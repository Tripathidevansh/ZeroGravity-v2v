/**
 * sosCameraService.ts
 *
 * A singleton (non-hook) camera service used by both:
 *   • EmergencySOSButton (button-triggered SOS)
 *   • VoiceSOSContext     (voice-triggered SOS)
 *
 * This avoids the problem of each React hook instance having its own
 * disconnected MediaStream ref.  The service manages a single permission
 * state and stream lifecycle for the whole app.
 */

import { supabase } from "@/services/supabaseClient";

export type CameraPermissionState = "prompt" | "granted" | "denied" | "unsupported";

// ─── Singleton state ──────────────────────────────────────────────────────────
let _permissionStatus: CameraPermissionState = (() => {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia)
    return "unsupported";
  const stored = localStorage.getItem("camera_sos_permission");
  if (stored === "granted") return "granted";
  if (stored === "denied") return "denied";
  return "prompt";
})();

const _listeners = new Set<(s: CameraPermissionState) => void>();

function setPermission(s: CameraPermissionState) {
  _permissionStatus = s;
  _listeners.forEach((fn) => fn(s));
}

// ─── Public helpers ───────────────────────────────────────────────────────────

export function getPermissionStatus(): CameraPermissionState {
  return _permissionStatus;
}

export function subscribePermission(
  fn: (s: CameraPermissionState) => void
): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/**
 * Prompt the user for camera access.
 * Call this in a user-gesture handler (button click) so the browser shows
 * the native permission dialog.
 */
export async function requestCameraPermission(): Promise<boolean> {
  if (!navigator.mediaDevices?.getUserMedia) {
    setPermission("unsupported");
    return false;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });
    // We only needed the permission; immediately release the track
    stream.getTracks().forEach((t) => t.stop());
    setPermission("granted");
    localStorage.setItem("camera_sos_permission", "granted");
    return true;
  } catch {
    setPermission("denied");
    localStorage.setItem("camera_sos_permission", "denied");
    return false;
  }
}

/**
 * Silently captures a JPEG photo, uploads it to the "sos-captures" bucket,
 * and inserts a metadata row in sos_photo_captures.
 *
 * Designed to run fire-and-forget after the SOS event is created.
 * Never throws — all errors are swallowed and logged.
 */
export async function captureSOSPhoto(opts: {
  emergencyEventId: string | null;
  triggerType: "button" | "voice";
  lat: number | null;
  lng: number | null;
}): Promise<void> {
  try {
    if (_permissionStatus !== "granted") {
      console.warn("[SOS Camera] Permission not granted — skipping capture.");
      return;
    }

    // ── 1. Open a fresh camera stream ─────────────────────────────────────
    console.log("[SOS Camera] Opening camera…");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });

    // ── 2. Render one frame into a hidden <video> ─────────────────────────
    const video = document.createElement("video");
    video.srcObject = stream;
    video.playsInline = true;
    video.muted = true;
    video.setAttribute("playsinline", ""); // iOS Safari

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Video load timeout")), 8000);
      video.onloadedmetadata = () => {
        clearTimeout(timeout);
        video
          .play()
          .then(() => setTimeout(resolve, 500)) // 500 ms for sensor warm-up
          .catch(reject);
      };
      video.onerror = () => { clearTimeout(timeout); reject(new Error("Video element error")); };
    });

    // ── 3. Draw frame to canvas ───────────────────────────────────────────
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas not available");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Release the camera immediately after capture
    stream.getTracks().forEach((t) => t.stop());
    console.log("[SOS Camera] Frame captured, camera released.");

    // ── 4. Convert to JPEG blob ───────────────────────────────────────────
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob returned null"))),
        "image/jpeg",
        0.88
      );
    });

    console.log("[SOS Camera] Blob size:", blob.size, "bytes");

    // ── 5. Get authenticated user ─────────────────────────────────────────
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn("[SOS Camera] No authenticated user — aborting upload.");
      return;
    }

    // ── 6. Upload to Supabase Storage ─────────────────────────────────────
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const suffix = Math.random().toString(36).substring(2, 8);
    const storagePath = `${user.id}/${timestamp}_${suffix}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("sos-captures")
      .upload(storagePath, blob, { contentType: "image/jpeg", upsert: false });

    if (uploadError) {
      console.error("[SOS Camera] Storage upload failed:", uploadError.message);
      return;
    }

    console.log("[SOS Camera] Uploaded to storage:", storagePath);

    // ── 7. Get a 7-day signed URL ─────────────────────────────────────────
    const { data: signedData } = await supabase.storage
      .from("sos-captures")
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7);

    const publicUrl = signedData?.signedUrl ?? null;

    // ── 8. Insert metadata row ────────────────────────────────────────────
    const { error: dbError } = await supabase
      .from("sos_photo_captures")
      .insert({
        user_id: user.id,
        emergency_event_id: opts.emergencyEventId,
        storage_path: storagePath,
        public_url: publicUrl,
        trigger_type: opts.triggerType,
        camera_facing: "environment" as const,
        lat: opts.lat,
        lng: opts.lng,
        address: null,
        mime_type: "image/jpeg",
        file_size_bytes: blob.size,
      });

    if (dbError) {
      console.error("[SOS Camera] DB insert failed:", dbError.message);
    } else {
      console.log("[SOS Camera] ✅ Photo saved to DB:", storagePath);
    }
  } catch (err) {
    console.error("[SOS Camera] Unexpected error:", err);
  }
}

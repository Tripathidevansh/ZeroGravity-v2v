import { useCallback, useRef, useState } from "react";
import { supabase } from "@/services/supabaseClient";

export type CameraPermissionState = "prompt" | "granted" | "denied" | "unsupported";

export interface CaptureResult {
  storagePath: string;
  publicUrl: string | null;
  fileSizeBytes: number;
}

interface SaveCaptureInput {
  emergencyEventId: string | null;
  triggerType: "button" | "voice";
  lat: number | null;
  lng: number | null;
  address: string | null;
  storagePath: string;
  publicUrl: string | null;
  fileSizeBytes: number;
}

/**
 * Saves a record of a captured photo to the sos_photo_captures table.
 * Non-fatal — if the DB insert fails we still have the photo in Storage.
 */
async function saveCaptureToDB(input: SaveCaptureInput): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("sos_photo_captures").insert({
    user_id: user.id,
    emergency_event_id: input.emergencyEventId,
    storage_path: input.storagePath,
    public_url: input.publicUrl,
    trigger_type: input.triggerType,
    camera_facing: "environment",
    lat: input.lat,
    lng: input.lng,
    address: input.address,
    mime_type: "image/jpeg",
    file_size_bytes: input.fileSizeBytes,
  });
}

/**
 * useCameraCapture
 *
 * Manages:
 *  • Camera permission lifecycle (requestPermission)
 *  • Silent photo capture via a hidden <video> + <canvas>
 *  • Upload to "sos-captures" Supabase Storage bucket
 *  • DB record insert into sos_photo_captures
 */
export function useCameraCapture() {
  const [permissionStatus, setPermissionStatus] =
    useState<CameraPermissionState>(() => {
      // On load, check if we already know the answer from localStorage
      const stored = localStorage.getItem("camera_sos_permission");
      if (stored === "granted") return "granted";
      if (stored === "denied") return "denied";
      if (!navigator.mediaDevices?.getUserMedia) return "unsupported";
      return "prompt";
    });

  const streamRef = useRef<MediaStream | null>(null);

  /**
   * Ask the browser for camera access. Stores the result in localStorage so we
   * know on next page load whether we should show the banner again.
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionStatus("unsupported");
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 },
        audio: false,
      });
      // Keep stream alive for faster capture later
      streamRef.current = stream;
      setPermissionStatus("granted");
      localStorage.setItem("camera_sos_permission", "granted");
      return true;
    } catch {
      setPermissionStatus("denied");
      localStorage.setItem("camera_sos_permission", "denied");
      return false;
    }
  }, []);

  /**
   * Captures a JPEG frame from the camera, uploads it to Supabase Storage,
   * and inserts a row into sos_photo_captures.
   *
   * Returns the capture result or null if anything fails.
   */
  const captureAndUpload = useCallback(
    async (opts: {
      emergencyEventId: string | null;
      triggerType: "button" | "voice";
      lat: number | null;
      lng: number | null;
      address: string | null;
    }): Promise<CaptureResult | null> => {
      try {
        // ------------------------------------------------------------------
        // 1. Ensure we have a camera stream
        // ------------------------------------------------------------------
        let stream = streamRef.current;
        const hasActiveTrack = stream?.getVideoTracks().some((t) => t.readyState === "live");

        if (!hasActiveTrack) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: 1280, height: 720 },
            audio: false,
          });
          streamRef.current = stream;
        }

        // ------------------------------------------------------------------
        // 2. Render one frame into a hidden <video> → <canvas>
        // ------------------------------------------------------------------
        const video = document.createElement("video");
        video.srcObject = stream!;
        video.playsInline = true;
        video.muted = true;

        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => {
            video.play().then(() => {
              // Give the camera sensor a short moment to adjust exposure
              setTimeout(resolve, 300);
            });
          };
        });

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D not available");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Stop video tracks to release camera LED
        stream!.getVideoTracks().forEach((t) => t.stop());
        streamRef.current = null;

        // ------------------------------------------------------------------
        // 3. Convert canvas to a Blob (JPEG)
        // ------------------------------------------------------------------
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
            "image/jpeg",
            0.88
          );
        });

        // ------------------------------------------------------------------
        // 4. Upload to Supabase Storage  →  sos-captures/<userId>/<timestamp>.jpg
        // ------------------------------------------------------------------
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const storagePath = `${user.id}/${timestamp}_${randomSuffix}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("sos-captures")
          .upload(storagePath, blob, {
            contentType: "image/jpeg",
            upsert: false,
          });

        if (uploadError) throw new Error(uploadError.message);

        // ------------------------------------------------------------------
        // 5. Build a signed URL (valid 7 days) for the uploaded file
        // ------------------------------------------------------------------
        const { data: signedData } = await supabase.storage
          .from("sos-captures")
          .createSignedUrl(storagePath, 60 * 60 * 24 * 7);

        const publicUrl = signedData?.signedUrl ?? null;
        const fileSizeBytes = blob.size;

        // ------------------------------------------------------------------
        // 6. Save metadata row in sos_photo_captures
        // ------------------------------------------------------------------
        await saveCaptureToDB({
          emergencyEventId: opts.emergencyEventId,
          triggerType: opts.triggerType,
          lat: opts.lat,
          lng: opts.lng,
          address: opts.address,
          storagePath,
          publicUrl,
          fileSizeBytes,
        });

        console.log("[SOS Camera] Photo captured and uploaded:", storagePath);
        return { storagePath, publicUrl, fileSizeBytes };
      } catch (err) {
        console.error("[SOS Camera] Capture/upload failed:", err);
        return null;
      }
    },
    []
  );

  /** Releases any held camera stream */
  const releaseCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  return { permissionStatus, requestPermission, captureAndUpload, releaseCamera };
}

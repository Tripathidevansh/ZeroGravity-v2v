import { useState, useEffect } from "react";
import { Camera, X, CheckCircle } from "lucide-react";
import {
  getPermissionStatus,
  requestCameraPermission,
  subscribePermission,
  type CameraPermissionState,
} from "@/services/sosCameraService";
import { cn } from "@/lib/cn";

/**
 * CameraPermissionBanner
 *
 * Shown below the Navbar inside AuthenticatedLayout whenever camera
 * permission has not yet been granted.  Uses the singleton sosCameraService
 * so the permission state is shared with the actual capture logic.
 */
export function CameraPermissionBanner() {
  const [permissionStatus, setPermissionStatus] = useState<CameraPermissionState>(
    getPermissionStatus
  );
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("camera_banner_dismissed") === "true"
  );
  const [requesting, setRequesting] = useState(false);
  const [justGranted, setJustGranted] = useState(false);

  // Stay in sync with singleton state
  useEffect(() => subscribePermission(setPermissionStatus), []);

  // Auto-dismiss 2 s after confirmation
  useEffect(() => {
    if (!justGranted) return;
    const t = setTimeout(() => setDismissed(true), 2000);
    return () => clearTimeout(t);
  }, [justGranted]);

  if (
    permissionStatus === "unsupported" ||
    permissionStatus === "granted" ||
    dismissed
  ) {
    return null;
  }

  const handleAllow = async () => {
    setRequesting(true);
    const ok = await requestCameraPermission();
    setRequesting(false);
    if (ok) setJustGranted(true);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("camera_banner_dismissed", "true");
  };

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 text-sm",
        "bg-primary-50 border-b border-primary-200",
        "animate-fade-in"
      )}
    >
      {justGranted ? (
        <>
          <CheckCircle size={16} className="shrink-0 text-emerald-600" />
          <span className="flex-1 font-medium text-emerald-800">
            Camera access granted — SOS photo capture is active ✓
          </span>
        </>
      ) : (
        <>
          <Camera size={16} className="shrink-0 text-primary-600" />
          <span className="flex-1 text-primary-900">
            <span className="font-semibold">Enable camera</span> so Nirbhaya AI can
            automatically capture a photo when SOS is triggered.
          </span>
          <button
            onClick={handleAllow}
            disabled={requesting}
            className={cn(
              "shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white",
              "hover:bg-primary-700 transition-colors duration-150 disabled:opacity-60"
            )}
          >
            {requesting ? "Asking…" : "Allow Camera"}
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss camera permission banner"
            className="shrink-0 rounded p-0.5 text-primary-400 hover:text-primary-700 transition-colors"
          >
            <X size={15} />
          </button>
        </>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export type GeolocationPermissionState = "prompt" | "granted" | "denied" | "unsupported";

export interface UseGeolocationOptions {
  /** When true, continuously watches position (for live tracking) instead
   * of fetching once. Defaults to false. */
  watch?: boolean;
}

export interface UseGeolocationResult {
  position: GeoPosition | null;
  error: string | null;
  permissionState: GeolocationPermissionState;
  isLoading: boolean;
  /** Re-requests the current position — useful after a permission prompt
   * was previously dismissed or denied. */
  refresh: () => void;
}

function toGeoPosition(pos: GeolocationPosition): GeoPosition {
  return {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
    heading: pos.coords.heading,
    speed: pos.coords.speed,
    timestamp: pos.timestamp,
  };
}

/**
 * Real browser GPS location — no hardcoded/default coordinates. If the
 * browser has no geolocation support or the user denies permission, callers
 * get `error` + `permissionState: "denied"` and should show an honest
 * "location needed" state rather than silently substituting a fake place.
 */
export function useGeolocation({ watch = false }: UseGeolocationOptions = {}): UseGeolocationResult {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<GeolocationPermissionState>("prompt");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState(0);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setPermissionState("unsupported");
      setError("Geolocation isn't supported by this browser.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const handleSuccess = (pos: GeolocationPosition) => {
      setPosition(toGeoPosition(pos));
      setPermissionState("granted");
      setError(null);
      setIsLoading(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      setPermissionState(err.code === err.PERMISSION_DENIED ? "denied" : "prompt");
      setError(err.message || "Couldn't determine your location.");
      setIsLoading(false);
    };

    if (watch) {
      watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      });
      return () => {
        if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      };
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, refreshToken]);

  const refresh = () => setRefreshToken((t) => t + 1);

  return { position, error, permissionState, isLoading, refresh };
}

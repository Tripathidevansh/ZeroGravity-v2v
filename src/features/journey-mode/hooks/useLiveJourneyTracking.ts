import { useEffect, useRef } from "react";
import { useGeolocation, type GeoPosition } from "@/hooks/useGeolocation";
import { updateJourneyLocation } from "@/features/journey-mode/api/journeysService";

const PERSIST_INTERVAL_MS = 5000; // "every few seconds," throttled client-side

export interface UseLiveJourneyTrackingResult {
  position: GeoPosition | null;
  error: string | null;
}

/**
 * Starts watching the browser's real GPS position the moment `journeyId` is
 * set (i.e. Journey Mode is active), and stops the moment it becomes null
 * (journey ended) — the browser watch is torn down via useGeolocation's own
 * cleanup, so there's no lingering tracking after a journey ends.
 *
 * Every position update is available immediately for the map to follow;
 * writes to Supabase are throttled to at most once per PERSIST_INTERVAL_MS
 * so a fast GPS chip doesn't flood the database.
 */
export function useLiveJourneyTracking(journeyId: string | null): UseLiveJourneyTrackingResult {
  const { position, error } = useGeolocation({ watch: journeyId !== null });
  const lastPersistedAtRef = useRef<number>(0);

  useEffect(() => {
    if (!journeyId || !position) return;

    const now = Date.now();
    if (now - lastPersistedAtRef.current < PERSIST_INTERVAL_MS) return;
    lastPersistedAtRef.current = now;

    updateJourneyLocation(journeyId, {
      lat: position.lat,
      lng: position.lng,
      heading: position.heading,
      speed: position.speed,
      accuracy: position.accuracy,
    }).catch((err) => {
      console.warn("[SafeCircle AI] Failed to persist live journey location:", err);
    });
  }, [journeyId, position]);

  // Reset the throttle window whenever tracking (re)starts for a journey.
  useEffect(() => {
    lastPersistedAtRef.current = 0;
  }, [journeyId]);

  return { position, error };
}

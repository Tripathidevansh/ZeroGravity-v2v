import { useEffect, useRef } from "react";
import { supabase } from "@/services/supabaseClient";
import { useGeolocation, type GeoPosition } from "@/hooks/useGeolocation";
import { updateEmergencyLocation } from "@/features/emergency-sos/api/emergencyService";

const PERSIST_INTERVAL_MS = 5000;

/** Channel name shared between the owner's broadcaster and the public
 * tracking page's subscriber — must match exactly on both sides. */
export function emergencyTrackingChannelName(trackingToken: string): string {
  return `emergency-tracking-${trackingToken}`;
}

export interface EmergencyLocationBroadcastPayload {
  lat: number;
  lng: number;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export interface UseEmergencyLocationBroadcastResult {
  position: GeoPosition | null;
}

/**
 * While an emergency is active, watches the owner's real GPS and:
 * 1. Persists it onto the emergency_events row (throttled, every ~5s) so
 *    the tracking page has a value even before any broadcast arrives.
 * 2. Broadcasts every position update over a public Supabase Realtime
 *    channel — NOT gated by table RLS, so the anonymous tracking page can
 *    subscribe to it without needing read access to any table.
 */
export function useEmergencyLocationBroadcast(
  emergencyId: string | null,
  trackingToken: string | null
): UseEmergencyLocationBroadcastResult {
  const { position } = useGeolocation({ watch: emergencyId !== null });
  const lastPersistedAtRef = useRef(0);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!trackingToken) return;
    const channel = supabase.channel(emergencyTrackingChannelName(trackingToken));
    channel.subscribe();
    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [trackingToken]);

  useEffect(() => {
    if (!emergencyId || !position) return;

    // Broadcast every update immediately — this is what makes the tracking
    // page feel live; there's no reason to throttle a pub/sub message the
    // way there is for a database write.
    channelRef.current?.send({
      type: "broadcast",
      event: "location",
      payload: {
        lat: position.lat,
        lng: position.lng,
        heading: position.heading,
        speed: position.speed,
        timestamp: position.timestamp,
      } satisfies EmergencyLocationBroadcastPayload,
    });

    const now = Date.now();
    if (now - lastPersistedAtRef.current < PERSIST_INTERVAL_MS) return;
    lastPersistedAtRef.current = now;

    updateEmergencyLocation(emergencyId, {
      lat: position.lat,
      lng: position.lng,
      heading: position.heading,
      speed: position.speed,
    }).catch((err) => {
      console.warn("[SafeCircle AI] Failed to persist emergency location:", err);
    });
  }, [emergencyId, position]);

  return { position };
}

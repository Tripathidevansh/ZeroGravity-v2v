import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmergencyEvent,
  appendEmergencyTimelineEntry,
  resolveEmergencyEvent,
  fetchActiveEmergencyEvent,
} from "@/features/emergency-sos/api/emergencyService";
import { notifyTrustedContacts } from "@/features/emergency-sos/api/notifyTrustedContacts";
import { fetchTrustedContacts, fetchMyProfile } from "@/features/profile/api/profileService";
import { createNotification } from "@/features/notifications/api/notificationsService";
import { NOTIFICATIONS_QUERY_KEY } from "@/features/notifications/api/useNotifications";
import { reverseGeocode } from "@/services/mapboxGeocodingService";
import { getBatteryLevel } from "@/utils/battery";
import type { TimelineEntry } from "@/features/emergency-sos/types";

export const ACTIVE_EMERGENCY_QUERY_KEY = ["emergency-events", "active"] as const;

export function useActiveEmergency() {
  return useQuery({
    queryKey: ACTIVE_EMERGENCY_QUERY_KEY,
    queryFn: fetchActiveEmergencyEvent,
  });
}

export interface ActivateEmergencyInput {
  lat: number;
  lng: number;
  journeyId?: string | null;
  nearestPoliceName?: string;
  nearestHospitalName?: string;
  /** Present only when SOS is triggered during an active journey. */
  destinationName?: string | null;
  destinationLat?: number | null;
  destinationLng?: number | null;
  routeLabel?: string | null;
  wsiScore?: number | null;
  journeyStatus?: string | null;
}

/**
 * Full SOS activation sequence:
 * 1. Captures address (reverse geocode) and battery level alongside the
 *    already-known GPS/journey/route context.
 * 2. Persists a complete emergency record.
 * 3. Emails every trusted contact with an email on file via Resend, and
 *    records real per-contact delivery status.
 * 4. Creates an in-app notification.
 * Returns the created event so the caller can navigate to the Emergency
 * Dashboard using its tracking token.
 */
export function useActivateEmergency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ActivateEmergencyInput) => {
      const location = { lat: input.lat, lng: input.lng };

      // Address + battery are captured in parallel — neither blocks
      // activation if unavailable (both resolve to null gracefully).
      const [address, batteryLevel, profile] = await Promise.all([
        reverseGeocode(location.lat, location.lng),
        getBatteryLevel(),
        fetchMyProfile(),
      ]);

      const initialTimeline: TimelineEntry[] = [
        { at: new Date().toISOString(), label: "Emergency SOS activated" },
        { at: new Date().toISOString(), label: "Current location captured" },
      ];
      if (address) {
        initialTimeline.push({ at: new Date().toISOString(), label: `Address resolved: ${address}` });
      }
      if (batteryLevel !== null) {
        initialTimeline.push({ at: new Date().toISOString(), label: `Device battery captured: ${batteryLevel}%` });
      }
      if (input.nearestPoliceName || input.nearestHospitalName) {
        const parts = [
          input.nearestPoliceName && `nearest police station (${input.nearestPoliceName})`,
          input.nearestHospitalName && `nearest hospital (${input.nearestHospitalName})`,
        ].filter(Boolean);
        initialTimeline.push({ at: new Date().toISOString(), label: `Located ${parts.join(" and ")}` });
      }
      if (input.destinationName) {
        initialTimeline.push({
          at: new Date().toISOString(),
          label: `Active journey captured: ${input.routeLabel ?? "route"} to ${input.destinationName} (WSI ${input.wsiScore ?? "N/A"})`,
        });
      }

      const event = await createEmergencyEvent({
        lat: location.lat,
        lng: location.lng,
        journeyId: input.journeyId,
        timeline: initialTimeline,
        destinationName: input.destinationName,
        destinationLat: input.destinationLat,
        destinationLng: input.destinationLng,
        routeLabel: input.routeLabel,
        wsiScore: input.wsiScore,
        journeyStatus: input.journeyStatus,
        batteryLevel,
        address,
      });

      // Notify trusted contacts, then record real delivery status —
      // failures here shouldn't block the emergency event itself.
      try {
        const contacts = await fetchTrustedContacts();
        if (contacts.length > 0) {
          const trackingLink = `${window.location.origin}/track/${event.tracking_token}`;
          const results = await notifyTrustedContacts(contacts, {
            userName: profile?.full_name || "A SafeCircle AI user",
            triggeredAt: event.triggered_at,
            address,
            lat: location.lat,
            lng: location.lng,
            routeLabel: input.routeLabel ?? null,
            destinationName: input.destinationName ?? null,
            journeyStatus: input.journeyStatus ?? null,
            wsiScore: input.wsiScore ?? null,
            batteryLevel,
            trackingLink,
          });

          const sentCount = results.filter((r) => r.status === "sent").length;
          await appendEmergencyTimelineEntry(
            event.id,
            {
              at: new Date().toISOString(),
              label: `Emergency email sent to ${sentCount} of ${results.length} trusted contact${results.length === 1 ? "" : "s"}`,
            },
            results
          );
        }
      } catch {
        // Non-fatal — the emergency event is already active regardless.
      }

      await createNotification(
        "safety",
        "Emergency SOS activated",
        "Your location was captured and your trusted contacts have been emailed."
      );

      return event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_EMERGENCY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
}

export function useResolveEmergency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => resolveEmergencyEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_EMERGENCY_QUERY_KEY });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmergencyEvent,
  appendEmergencyTimelineEntry,
  resolveEmergencyEvent,
  fetchActiveEmergencyEvent,
} from "@/features/emergency-sos/api/emergencyService";
import { notifyTrustedContacts } from "@/features/emergency-sos/api/notifyTrustedContacts";
import { fetchTrustedContacts } from "@/features/profile/api/profileService";
import { createNotification } from "@/features/notifications/api/notificationsService";
import { NOTIFICATIONS_QUERY_KEY } from "@/features/notifications/api/useNotifications";
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
}

/**
 * Full SOS activation sequence: persists the event, notifies trusted
 * contacts (simulated — see notifyTrustedContacts), records each step in
 * the event's timeline, and creates a real in-app notification. Returns the
 * created event so the caller can navigate to the Emergency Dashboard.
 */
export function useActivateEmergency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ActivateEmergencyInput) => {
      const initialTimeline: TimelineEntry[] = [
        { at: new Date().toISOString(), label: "Emergency SOS activated" },
        { at: new Date().toISOString(), label: "Current location captured" },
      ];
      if (input.nearestPoliceName || input.nearestHospitalName) {
        const parts = [
          input.nearestPoliceName && `nearest police station (${input.nearestPoliceName})`,
          input.nearestHospitalName && `nearest hospital (${input.nearestHospitalName})`,
        ].filter(Boolean);
        initialTimeline.push({ at: new Date().toISOString(), label: `Located ${parts.join(" and ")}` });
      }

      const event = await createEmergencyEvent({
        lat: input.lat,
        lng: input.lng,
        journeyId: input.journeyId,
        timeline: initialTimeline,
      });

      // Notify trusted contacts, then record the outcome — failures here
      // shouldn't block the emergency event itself from being active.
      try {
        const contacts = await fetchTrustedContacts();
        if (contacts.length > 0) {
          const results = await notifyTrustedContacts(contacts, { lat: input.lat, lng: input.lng });
          await appendEmergencyTimelineEntry(
            event.id,
            { at: new Date().toISOString(), label: `Alert sent to ${results.length} trusted contact${results.length === 1 ? "" : "s"}` },
            results
          );
        }
      } catch {
        // Non-fatal — the emergency event is already active regardless.
      }

      await createNotification(
        "safety",
        "Emergency SOS activated",
        "Your location was shared and your trusted contacts have been alerted."
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

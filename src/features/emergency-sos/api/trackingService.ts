import { supabase } from "@/services/supabaseClient";
import type { EmergencyEventRow } from "@/features/emergency-sos/api/emergencyService";
import type { JourneyRow } from "@/features/journey-mode/api/journeysService";

export interface TrackingSnapshot {
  emergency: EmergencyEventRow;
  journey: JourneyRow | null;
  ownerName: string;
}

/** The only client-side call the public tracking page makes for data — goes
 * through the get-emergency-tracking edge function (service role, scoped by
 * token), never touches emergency_events/journeys directly. */
export async function fetchTrackingSnapshot(trackingToken: string): Promise<TrackingSnapshot> {
  const { data, error } = await supabase.functions.invoke<TrackingSnapshot>("get-emergency-tracking", {
    body: { trackingToken },
  });

  if (error) throw new Error(error.message);
  if (!data) throw new Error("This tracking link is invalid or has expired.");
  return data;
}

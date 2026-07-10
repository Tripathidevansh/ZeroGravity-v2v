import { supabase } from "@/services/supabaseClient";
import type { Database } from "@/types/database";
import type { TimelineEntry, NotifiedContactResult } from "@/features/emergency-sos/types";

export type EmergencyEventRow = Database["public"]["Tables"]["emergency_events"]["Row"];

export interface CreateEmergencyEventInput {
  lat: number;
  lng: number;
  journeyId?: string | null;
  timeline: TimelineEntry[];
}

export async function createEmergencyEvent(input: CreateEmergencyEventInput): Promise<EmergencyEventRow> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to activate Emergency SOS.");

  const { data, error } = await supabase
    .from("emergency_events")
    .insert({
      user_id: user.id,
      journey_id: input.journeyId ?? null,
      lat: input.lat,
      lng: input.lng,
      timeline: input.timeline,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Appends one entry to the event's timeline and optionally records which
 * trusted contacts were notified — read-modify-write is fine here since
 * emergency events are single-user, low-concurrency records. */
export async function appendEmergencyTimelineEntry(
  eventId: string,
  entry: TimelineEntry,
  notifiedContacts?: NotifiedContactResult[]
): Promise<void> {
  const { data: existing, error: fetchError } = await supabase
    .from("emergency_events")
    .select("timeline, notified_contacts")
    .eq("id", eventId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const { error: updateError } = await supabase
    .from("emergency_events")
    .update({
      timeline: [...(existing.timeline ?? []), entry],
      ...(notifiedContacts ? { notified_contacts: notifiedContacts } : {}),
    })
    .eq("id", eventId);

  if (updateError) throw new Error(updateError.message);
}

export async function resolveEmergencyEvent(eventId: string): Promise<void> {
  const { data: existing, error: fetchError } = await supabase
    .from("emergency_events")
    .select("timeline")
    .eq("id", eventId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const resolvedEntry: TimelineEntry = { at: new Date().toISOString(), label: "Emergency marked as resolved" };

  const { error } = await supabase
    .from("emergency_events")
    .update({
      status: "resolved",
      resolved_at: new Date().toISOString(),
      timeline: [...(existing.timeline ?? []), resolvedEntry],
    })
    .eq("id", eventId);

  if (error) throw new Error(error.message);
}

export async function fetchActiveEmergencyEvent(): Promise<EmergencyEventRow | null> {
  const { data, error } = await supabase
    .from("emergency_events")
    .select("*")
    .eq("status", "active")
    .order("triggered_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

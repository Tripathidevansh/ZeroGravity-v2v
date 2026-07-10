import { supabase } from "@/services/supabaseClient";
import type { Database } from "@/types/database";

export type JourneyRow = Database["public"]["Tables"]["journeys"]["Row"];

export interface StartJourneyInput {
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  originLat: number;
  originLng: number;
  distanceKm: number;
  durationMin: number;
  wsiScore: number;
}

export async function startJourney(input: StartJourneyInput): Promise<JourneyRow> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to start a journey.");

  const { data, error } = await supabase
    .from("journeys")
    .insert({
      user_id: user.id,
      destination_name: input.destinationName,
      destination_lat: input.destinationLat,
      destination_lng: input.destinationLng,
      origin_lat: input.originLat,
      origin_lng: input.originLng,
      distance_km: input.distanceKm,
      duration_min: input.durationMin,
      wsi_score: input.wsiScore,
      status: "active",
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function endJourney(journeyId: string, status: "completed" | "cancelled" = "completed"): Promise<void> {
  const { error } = await supabase
    .from("journeys")
    .update({ status, completed_at: new Date().toISOString() })
    .eq("id", journeyId);

  if (error) throw new Error(error.message);
}

export async function fetchJourneyHistory(limit = 10): Promise<JourneyRow[]> {
  const { data, error } = await supabase
    .from("journeys")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchActiveJourney(): Promise<JourneyRow | null> {
  const { data, error } = await supabase
    .from("journeys")
    .select("*")
    .eq("status", "active")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

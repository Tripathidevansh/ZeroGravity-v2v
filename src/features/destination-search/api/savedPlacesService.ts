import { supabase } from "@/services/supabaseClient";
import type { Database } from "@/types/database";

export type SavedPlaceRow = Database["public"]["Tables"]["saved_places"]["Row"];

export async function fetchSavedPlaces(): Promise<SavedPlaceRow[]> {
  const { data, error } = await supabase.from("saved_places").select("*").order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface CreateSavedPlaceInput {
  name: string;
  address: string;
  category: SavedPlaceRow["category"];
  lat: number;
  lng: number;
}

export async function createSavedPlace(input: CreateSavedPlaceInput): Promise<SavedPlaceRow> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to save a place.");

  const { data, error } = await supabase
    .from("saved_places")
    .insert({ ...input, user_id: user.id })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSavedPlace(id: string): Promise<void> {
  const { error } = await supabase.from("saved_places").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

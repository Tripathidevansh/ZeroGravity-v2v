import { supabase } from "@/services/supabaseClient";
import type { Database } from "@/types/database";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type TrustedContactRow = Database["public"]["Tables"]["trusted_contacts"]["Row"];

export async function fetchMyProfile(): Promise<ProfileRow | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateMyProfile(updates: Partial<Pick<ProfileRow, "full_name" | "avatar_url">>): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  if (error) throw new Error(error.message);
}

/** Number of community reports the current user has filed — used as the
 * profile's "contribution count". */
export async function fetchMyContributionCount(): Promise<number> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("community_reports")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function fetchTrustedContacts(): Promise<TrustedContactRow[]> {
  const { data, error } = await supabase.from("trusted_contacts").select("*").order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface CreateTrustedContactInput {
  name: string;
  relation: string;
  phone: string;
  isEmergencyContact?: boolean;
}

export async function createTrustedContact(input: CreateTrustedContactInput): Promise<TrustedContactRow> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");

  const { data, error } = await supabase
    .from("trusted_contacts")
    .insert({
      user_id: user.id,
      name: input.name,
      relation: input.relation,
      phone: input.phone,
      is_emergency_contact: input.isEmergencyContact ?? false,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

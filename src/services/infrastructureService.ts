import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabaseClient";
import type { Database } from "@/types/database";

export type InfrastructurePoint = Database["public"]["Tables"]["infrastructure_points"]["Row"];

export async function fetchInfrastructurePoints(): Promise<InfrastructurePoint[]> {
  const { data, error } = await supabase.from("infrastructure_points").select("*");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export function useInfrastructurePoints() {
  return useQuery({
    queryKey: ["infrastructure-points"],
    queryFn: fetchInfrastructurePoints,
    staleTime: 10 * 60 * 1000, // reference data, changes rarely
  });
}

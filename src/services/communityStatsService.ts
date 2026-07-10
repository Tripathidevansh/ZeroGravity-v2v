import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabaseClient";

export interface CommunityStatsRow {
  total_reports: number;
  active_members: number;
  safer_routes_chosen: number;
  reports_this_week: number;
}

export async function fetchCommunityStats(): Promise<CommunityStatsRow> {
  const { data, error } = await supabase.rpc("get_community_stats").single();
  if (error) throw new Error(error.message);
  return data as CommunityStatsRow;
}

export function useCommunityStats() {
  return useQuery({
    queryKey: ["community-stats"],
    queryFn: fetchCommunityStats,
    staleTime: 5 * 60 * 1000,
  });
}

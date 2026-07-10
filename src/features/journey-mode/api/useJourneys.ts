import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  startJourney,
  endJourney,
  fetchJourneyHistory,
  fetchActiveJourney,
  type StartJourneyInput,
} from "@/features/journey-mode/api/journeysService";

export const JOURNEYS_QUERY_KEY = ["journeys"] as const;
export const ACTIVE_JOURNEY_QUERY_KEY = ["journeys", "active"] as const;

export function useJourneyHistory(limit = 10) {
  return useQuery({
    queryKey: [...JOURNEYS_QUERY_KEY, limit],
    queryFn: () => fetchJourneyHistory(limit),
  });
}

export function useActiveJourney() {
  return useQuery({
    queryKey: ACTIVE_JOURNEY_QUERY_KEY,
    queryFn: fetchActiveJourney,
  });
}

export function useStartJourney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: StartJourneyInput) => startJourney(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNEYS_QUERY_KEY });
    },
  });
}

export function useEndJourney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ journeyId, status }: { journeyId: string; status?: "completed" | "cancelled" }) =>
      endJourney(journeyId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOURNEYS_QUERY_KEY });
    },
  });
}

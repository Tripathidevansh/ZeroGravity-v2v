import { QueryClient } from "@tanstack/react-query";

/**
 * Central React Query client.
 * Phase 1: default configuration only. Feature-level queries/mutations
 * will live under src/features/<feature>/api in later phases.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

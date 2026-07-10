import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabaseClient";
import type { RouteOption } from "@/features/route-recommendation/types";

interface RouteExplanationResponse {
  explanation?: string;
  error?: string;
}

async function fetchRouteExplanation(route: RouteOption, destinationName: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke<RouteExplanationResponse>("route-explanation", {
    body: {
      routeLabel: route.label,
      destinationName,
      wsiScore: route.wsi,
      distanceKm: route.distanceKm,
      durationMin: route.durationMin,
      reportCount: route.alertsCount,
      highlights: route.highlights,
    },
  });

  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data?.explanation ?? "No explanation available for this route.";
}

/**
 * AI-generated, one-shot explanation of a route's safety score — not a
 * chatbot, no conversation state. Requires the `route-explanation` edge
 * function to be deployed with a GEMINI_API_KEY secret; until then this
 * hook will surface an error which the UI shows via the existing error/empty
 * state pattern rather than crashing the page.
 */
export function useRouteExplanation(route: RouteOption | null, destinationName: string) {
  return useQuery({
    queryKey: ["route-explanation", route?.id],
    queryFn: () => fetchRouteExplanation(route!, destinationName),
    enabled: Boolean(route),
    staleTime: Infinity, // a route's explanation never changes once generated
    retry: 1,
  });
}

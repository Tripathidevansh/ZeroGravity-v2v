import { useQuery } from "@tanstack/react-query";
import type { MapMarkerType } from "@/components/shared/MapView";

/**
 * A live nearby place, normalized from Mapbox's Search Box Category API into
 * the same shape the rest of the app already expects — this is what used to
 * come from the hardcoded `infrastructure_points` table. No hardcoded data
 * remains; every result here is a real, current Mapbox place.
 */
export interface InfrastructurePoint {
  id: string;
  name: string;
  type: Exclude<MapMarkerType, "report">;
  address: string;
  lat: number;
  lng: number;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
const SEARCH_ENDPOINT = "https://api.mapbox.com/search/searchbox/v1/category";

/**
 * Maps our marker categories to Mapbox's documented canonical category IDs
 * (https://docs.mapbox.com/api/search/search-box/#category-search).
 * "safe-place" has no direct Mapbox equivalent — a public safe place isn't a
 * real-world category any provider models directly — so it's approximated
 * with well-lit, populated commercial venues (shopping centers), which is
 * the same interpretive call the app made before this change, just now
 * backed by live data instead of a fixed list.
 */
const CATEGORY_MAP: Record<Exclude<MapMarkerType, "report">, string> = {
  police: "police",
  hospital: "hospital",
  pharmacy: "pharmacy",
  metro: "railway_station",
  fuel: "gas_station",
  "safe-place": "shopping_mall",
};

const RESULTS_PER_CATEGORY = 3;

interface MapboxSearchFeature {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    name?: string;
    name_preferred?: string;
    full_address?: string;
    place_formatted?: string;
    address?: string;
    mapbox_id?: string;
  };
}

async function fetchCategory(
  type: Exclude<MapMarkerType, "report">,
  location: { lat: number; lng: number }
): Promise<InfrastructurePoint[]> {
  if (!MAPBOX_TOKEN) return [];

  const category = CATEGORY_MAP[type];
  const url = `${SEARCH_ENDPOINT}/${category}?proximity=${location.lng},${location.lat}&limit=${RESULTS_PER_CATEGORY}&access_token=${MAPBOX_TOKEN}`;

  const response = await fetch(url);
  if (!response.ok) {
    // Fails soft — one category being unavailable shouldn't break the rest.
    console.warn(`[SafeCircle AI] Mapbox category search for "${category}" failed: ${response.status}`);
    return [];
  }

  const data = await response.json();
  const features: MapboxSearchFeature[] = data?.features ?? [];

  return features
    .filter((f) => f.geometry?.coordinates)
    .map((f, i) => {
      const [lng, lat] = f.geometry!.coordinates!;
      return {
        id: f.properties?.mapbox_id ?? `${type}-${lat}-${lng}-${i}`,
        name: f.properties?.name ?? f.properties?.name_preferred ?? "Unnamed location",
        type,
        address: f.properties?.full_address ?? f.properties?.place_formatted ?? f.properties?.address ?? "",
        lat,
        lng,
      };
    });
}

/** Fetches all nearby-place categories in parallel around a location. A
 * failure in one category never blocks the others (Promise.allSettled). */
export async function fetchNearbyPlaces(location: { lat: number; lng: number }): Promise<InfrastructurePoint[]> {
  if (!MAPBOX_TOKEN) {
    console.warn("[SafeCircle AI] VITE_MAPBOX_TOKEN is not set — nearby places require a Mapbox token to load.");
    return [];
  }

  const types = Object.keys(CATEGORY_MAP) as Exclude<MapMarkerType, "report">[];
  const results = await Promise.allSettled(types.map((type) => fetchCategory(type, location)));

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

/** Rounds to ~3 decimal places (~110m) so minor GPS jitter doesn't trigger a
 * refetch storm, while still updating whenever the user meaningfully moves. */
function locationCacheKey(location: { lat: number; lng: number }) {
  return `${location.lat.toFixed(3)},${location.lng.toFixed(3)}`;
}

export function useNearbyPlaces(location: { lat: number; lng: number } | null) {
  return useQuery({
    queryKey: ["nearby-places", location ? locationCacheKey(location) : null],
    queryFn: () => fetchNearbyPlaces(location!),
    enabled: location !== null,
    staleTime: 2 * 60 * 1000,
  });
}

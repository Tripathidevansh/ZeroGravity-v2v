const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
const SUGGEST_ENDPOINT = "https://api.mapbox.com/search/searchbox/v1/suggest";
const RETRIEVE_ENDPOINT = "https://api.mapbox.com/search/searchbox/v1/retrieve";

export interface PlaceSuggestion {
  mapboxId: string;
  name: string;
  placeFormatted: string;
}

export interface RetrievedPlace {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface MapboxSuggestion {
  mapbox_id?: string;
  name?: string;
  name_preferred?: string;
  place_formatted?: string;
  full_address?: string;
}

interface MapboxRetrieveFeature {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    name?: string;
    name_preferred?: string;
    full_address?: string;
    place_formatted?: string;
  };
}

/**
 * Live, unrestricted place autocomplete — any real-world searchable
 * location (address, landmark, hospital, mall, university, airport,
 * restaurant, etc.), not limited to a fixed category list. Mirrors the
 * Google Maps search pattern: type → suggestions → pick one → get
 * coordinates.
 *
 * Uses Mapbox's two-step Search Box flow: `suggest` returns lightweight
 * candidates (no coordinates yet), `retrieve` resolves a chosen candidate's
 * `mapbox_id` into full coordinates. Both calls in a search session should
 * share the same `sessionToken` per Mapbox's billing model.
 */
export async function suggestPlaces(
  query: string,
  sessionToken: string,
  proximity?: { lat: number; lng: number }
): Promise<PlaceSuggestion[]> {
  if (!MAPBOX_TOKEN || query.trim().length < 2) return [];

  const params = new URLSearchParams({
    q: query,
    session_token: sessionToken,
    access_token: MAPBOX_TOKEN,
  });
  if (proximity) params.set("proximity", `${proximity.lng},${proximity.lat}`);

  const response = await fetch(`${SUGGEST_ENDPOINT}?${params.toString()}`);
  if (!response.ok) {
    console.warn(`[SafeCircle AI] Mapbox suggest failed: ${response.status}`);
    return [];
  }

  const data = await response.json();
  const suggestions: MapboxSuggestion[] = data?.suggestions ?? [];

  return suggestions
    .filter((s) => s.mapbox_id)
    .map((s) => ({
      mapboxId: s.mapbox_id!,
      name: s.name ?? s.name_preferred ?? "Unknown place",
      placeFormatted: s.place_formatted ?? s.full_address ?? "",
    }));
}

export async function retrievePlace(mapboxId: string, sessionToken: string): Promise<RetrievedPlace | null> {
  if (!MAPBOX_TOKEN) return null;

  const params = new URLSearchParams({ session_token: sessionToken, access_token: MAPBOX_TOKEN });
  const response = await fetch(`${RETRIEVE_ENDPOINT}/${mapboxId}?${params.toString()}`);
  if (!response.ok) {
    console.warn(`[SafeCircle AI] Mapbox retrieve failed: ${response.status}`);
    return null;
  }

  const data = await response.json();
  const feature: MapboxRetrieveFeature | undefined = data?.features?.[0];
  if (!feature?.geometry?.coordinates) return null;

  const [lng, lat] = feature.geometry.coordinates;
  return {
    name: feature.properties?.name ?? feature.properties?.name_preferred ?? "Selected place",
    address: feature.properties?.full_address ?? feature.properties?.place_formatted ?? "",
    lat,
    lng,
  };
}

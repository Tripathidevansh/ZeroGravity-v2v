const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

// Mapbox's longest-stable, most broadly documented geocoding endpoint —
// chosen over the newer Search Box "reverse" endpoint for this specific
// call since it's the one most likely to remain exactly as documented.
const REVERSE_GEOCODE_ENDPOINT = "https://api.mapbox.com/geocoding/v5/mapbox.places";

/** Resolves coordinates to a human-readable address, e.g. for the emergency
 * record's captured location. Returns null if unavailable rather than
 * throwing — an emergency activation must never fail because of this. */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  if (!MAPBOX_TOKEN) return null;

  try {
    const url = `${REVERSE_GEOCODE_ENDPOINT}/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[SafeCircle AI] Reverse geocoding failed: ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data?.features?.[0]?.place_name ?? null;
  } catch (err) {
    console.warn("[SafeCircle AI] Reverse geocoding error:", err);
    return null;
  }
}

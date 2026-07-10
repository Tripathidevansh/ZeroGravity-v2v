/**
 * True last-resort fallback — used ONLY when the browser has no geolocation
 * support or the user denies/times out a permission prompt, so a one-shot
 * action (filing a report, activating SOS) can still complete rather than
 * fail outright. This is not used anywhere as an assumed "current location"
 * — every live feature (nearby places, route generation, dashboard) requires
 * a real GPS fix via useGeolocation() and shows an honest permission-needed
 * state instead of silently substituting this.
 */
export const GEOLOCATION_FALLBACK = { lat: 28.6098, lng: 77.3649 }; // Noida, India

/** Best-effort current position for one-shot actions; resolves with a real
 * GPS fix when available, or the fallback above if denied/unavailable. */
export function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(GEOLOCATION_FALLBACK);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(GEOLOCATION_FALLBACK),
      { timeout: 4000 }
    );
  });
}

import type { SavedLocation } from "@/features/destination-search/types";
import type { RouteOption } from "@/features/route-recommendation/types";
import type { MapRoutePoint } from "@/components/shared/MapView";

// Default "current location" used as the journey origin across the demo —
// JIIT, Sector 62, Noida.
export const DEFAULT_ORIGIN: MapRoutePoint = { lat: 28.6098, lng: 77.3649 };

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function buildPath(origin: MapRoutePoint, destination: MapRoutePoint, jitter: number, rand: () => number): MapRoutePoint[] {
  const steps = 4;
  const points: MapRoutePoint[] = [origin];
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    points.push({
      lat: origin.lat + (destination.lat - origin.lat) * t + (rand() - 0.5) * jitter,
      lng: origin.lng + (destination.lng - origin.lng) * t + (rand() - 0.5) * jitter,
    });
  }
  points.push(destination);
  return points;
}

const HIGHLIGHT_POOL = {
  positive: [
    "Well-lit main road throughout",
    "Passes 2 active police checkpoints",
    "Busy commercial stretch, high footfall",
    "CCTV coverage on most of the route",
    "Wide footpaths, low traffic speed",
  ],
  negative: [
    "Stretch with limited street lighting",
    "Isolated road for ~1.2 km",
    "Under-construction section, low visibility",
    "Recent reports of suspicious activity",
    "Sparse footfall after 9 PM",
  ],
};

function pick<T>(pool: T[], rand: () => number, count: number): T[] {
  const shuffled = [...pool].sort(() => rand() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Generates 3 deterministic mock routes for a destination — same
 * destination always yields the same routes, so the demo feels stable
 * across refreshes rather than random every time.
 */
export function generateRoutes(destination: SavedLocation, origin: MapRoutePoint = DEFAULT_ORIGIN): RouteOption[] {
  const baseSeed = hashSeed(destination.id);

  const templates = [
    { label: "Route A", durationBase: 14, distanceBase: 7.2, wsiBase: 91 },
    { label: "Route B", durationBase: 16, distanceBase: 6.8, wsiBase: 74 },
    { label: "Route C", durationBase: 13, distanceBase: 6.4, wsiBase: 56 },
  ];

  const routes: RouteOption[] = templates.map((tpl, index) => {
    const localSeed = baseSeed + index * 97;
    const localRand = seededRandom(localSeed);
    const wsiJitter = Math.round((localRand() - 0.5) * 8);
    const wsi = Math.max(35, Math.min(98, tpl.wsiBase + wsiJitter));
    const duration = Math.max(9, tpl.durationBase + Math.round((localRand() - 0.5) * 4));
    const distance = Math.max(3, +(tpl.distanceBase + (localRand() - 0.5) * 1.2).toFixed(1));
    const alertsCount = wsi >= 90 ? Math.round(localRand() * 2) : wsi >= 70 ? 2 + Math.round(localRand() * 2) : 4 + Math.round(localRand() * 3);

    const highlights =
      wsi >= 80
        ? pick(HIGHLIGHT_POOL.positive, localRand, 2)
        : wsi >= 65
          ? [...pick(HIGHLIGHT_POOL.positive, localRand, 1), ...pick(HIGHLIGHT_POOL.negative, localRand, 1)]
          : pick(HIGHLIGHT_POOL.negative, localRand, 2);

    return {
      id: `${destination.id}-route-${index}`,
      label: tpl.label,
      durationMin: duration,
      distanceKm: distance,
      wsi,
      alertsCount,
      recommended: false,
      highlights,
      path: buildPath(origin, { lat: destination.lat, lng: destination.lng }, 0.01 + index * 0.006, localRand),
    };
  });

  const best = routes.reduce((a, b) => (b.wsi > a.wsi ? b : a));
  best.recommended = true;

  return routes.sort((a, b) => b.wsi - a.wsi);
}

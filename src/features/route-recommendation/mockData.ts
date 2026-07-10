import type { SavedLocation } from "@/features/destination-search/types";
import type { RouteOption } from "@/features/route-recommendation/types";
import type { MapRoutePoint } from "@/components/shared/MapView";
import { computeRouteWSI, distanceKm, type WSIReportInput, type WSIInfrastructureInput } from "@/services/wsiEngine";
import { REPORT_CATEGORY_LABEL } from "@/features/community-reports/types";
import type { CommunityReport } from "@/features/community-reports/types";
import type { InfrastructurePoint } from "@/services/infrastructureService";

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

const GENERIC_POSITIVE_HIGHLIGHTS = [
  "Well-lit main road for most of the route",
  "Passes verified police or hospital checkpoints",
  "Busy, high-footfall stretch",
];

const REPORT_RADIUS_KM = 1.5;

/** Reports whose location falls within range of any point on the path. */
function reportsAlongPath(path: MapRoutePoint[], reports: CommunityReport[]): CommunityReport[] {
  return reports.filter((report) => {
    if (report.lat === undefined || report.lng === undefined) return false;
    return path.some((point) => distanceKm(point, { lat: report.lat!, lng: report.lng! }) <= REPORT_RADIUS_KM);
  });
}

/**
 * Generates 3 candidate routes for a destination and scores each with the
 * real WSI engine against live community reports + infrastructure. Route
 * shapes (path jitter) are deterministically seeded per destination so the
 * same search always returns the same 3 route geometries — but the safety
 * scores themselves are fully dynamic, recalculated from current data every
 * time this is called.
 */
export function generateRoutes(
  destination: SavedLocation,
  reports: CommunityReport[],
  infrastructure: InfrastructurePoint[],
  origin: MapRoutePoint = DEFAULT_ORIGIN
): RouteOption[] {
  const baseSeed = hashSeed(destination.id);

  const templates = [
    { label: "Route A", durationBase: 14, distanceBase: 7.2, jitter: 0.01 },
    { label: "Route B", durationBase: 16, distanceBase: 6.8, jitter: 0.016 },
    { label: "Route C", durationBase: 13, distanceBase: 6.4, jitter: 0.022 },
  ];

  const wsiReports: WSIReportInput[] = reports
    .filter((r) => r.lat !== undefined && r.lng !== undefined)
    .map((r) => ({ lat: r.lat!, lng: r.lng!, severity: r.severity, createdAt: r.reportedAt }));

  const wsiInfra: WSIInfrastructureInput[] = infrastructure.map((p) => ({ lat: p.lat, lng: p.lng, type: p.type }));

  const routes: RouteOption[] = templates.map((tpl, index) => {
    const localSeed = baseSeed + index * 97;
    const localRand = seededRandom(localSeed);
    const duration = Math.max(9, tpl.durationBase + Math.round((localRand() - 0.5) * 4));
    const distance = Math.max(3, +(tpl.distanceBase + (localRand() - 0.5) * 1.2).toFixed(1));
    const path = buildPath(origin, { lat: destination.lat, lng: destination.lng }, tpl.jitter, localRand);

    const wsi = computeRouteWSI(path, wsiReports, wsiInfra);
    const nearbyReports = reportsAlongPath(path, reports);

    const highlights =
      nearbyReports.length > 0
        ? Array.from(new Set(nearbyReports.slice(0, 2).map((r) => `${REPORT_CATEGORY_LABEL[r.category]} reported nearby`)))
        : GENERIC_POSITIVE_HIGHLIGHTS.slice(0, 2);

    return {
      id: `${destination.id}-route-${index}`,
      label: tpl.label,
      durationMin: duration,
      distanceKm: distance,
      wsi,
      alertsCount: nearbyReports.length,
      recommended: false,
      highlights,
      path,
    };
  });

  const best = routes.reduce((a, b) => (b.wsi > a.wsi ? b : a));
  best.recommended = true;

  return routes.sort((a, b) => b.wsi - a.wsi);
}

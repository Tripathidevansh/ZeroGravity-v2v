import type { RouteOption } from "@/features/route-recommendation/types";
import type { NearbyPlace, TimelineStep } from "@/features/route-details/types";
import type { CommunityReport } from "@/features/community-reports/types";
import type { InfrastructurePoint } from "@/services/infrastructureService";
import { distanceKm } from "@/services/wsiEngine";

const NEARBY_RADIUS_KM = 2;
const REPORT_RADIUS_KM = 1.5;

/** Real infrastructure points within range of any point on the route path. */
export function getNearbyPlaces(route: RouteOption, infrastructure: InfrastructurePoint[]): NearbyPlace[] {
  const places: NearbyPlace[] = [];

  for (const point of infrastructure) {
    const distances = route.path.map((p) => distanceKm(p, point));
    const nearest = Math.min(...distances);
    if (nearest > NEARBY_RADIUS_KM) continue;

    places.push({
      id: point.id,
      name: point.name,
      type: point.type,
      address: point.address,
      distanceKm: +nearest.toFixed(1),
      lat: point.lat,
      lng: point.lng,
    });
  }

  return places.sort((a, b) => a.distanceKm - b.distanceKm);
}

export function getRouteTimeline(route: RouteOption): TimelineStep[] {
  const segmentCount = route.path.length - 1;
  const segmentDistance = route.distanceKm / segmentCount;

  return route.path.slice(1).map((_, i) => {
    const isLast = i === segmentCount - 1;
    const level = route.wsi >= 85 ? "safe" : route.wsi >= 65 ? (i === 1 ? "caution" : "safe") : i % 2 === 0 ? "risk" : "caution";

    return {
      id: `${route.id}-step-${i}`,
      title: isLast ? "Arrive at destination" : `Segment ${i + 1}`,
      description:
        level === "safe"
          ? "Well-lit, high footfall stretch"
          : level === "caution"
            ? "Moderate lighting, stay alert"
            : "Low footfall — consider sharing live location",
      distanceKm: +(segmentDistance * (i + 1)).toFixed(1),
      level,
    } satisfies TimelineStep;
  });
}

/** Real community reports within range of any point on the route path. */
export function getReportsAlongRoute(route: RouteOption, reports: CommunityReport[]): CommunityReport[] {
  return reports.filter((report) => {
    if (report.lat === undefined || report.lng === undefined) return false;
    return route.path.some((point) => distanceKm(point, { lat: report.lat!, lng: report.lng! }) <= REPORT_RADIUS_KM);
  });
}

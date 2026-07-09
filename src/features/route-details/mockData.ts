import type { RouteOption } from "@/features/route-recommendation/types";
import type { NearbyPlace, TimelineStep } from "@/features/route-details/types";
import { COMMUNITY_REPORTS } from "@/features/community-reports/mockData";
import type { CommunityReport } from "@/features/community-reports/types";

const NEARBY_POLICE_NAMES = ["Sector 58 Police Post", "Sector 39 Police Station"];
const NEARBY_HOSPITAL_NAMES = ["Fortis Hospital", "Kailash Hospital"];
const NEARBY_SAFE_PLACE_NAMES = ["24/7 Fuel Station", "DLF Mall of India", "Metro Station Help Desk"];

function jitterPoint(base: { lat: number; lng: number }, magnitude: number, seed: number) {
  const dx = (Math.sin(seed) * magnitude) % magnitude;
  const dy = (Math.cos(seed * 1.7) * magnitude) % magnitude;
  return { lat: base.lat + dx, lng: base.lng + dy };
}

export function getNearbyPlaces(route: RouteOption): NearbyPlace[] {
  const midpoint = route.path[Math.floor(route.path.length / 2)];
  const places: NearbyPlace[] = [];

  NEARBY_POLICE_NAMES.forEach((name, i) => {
    const p = jitterPoint(midpoint, 0.012, i + 1);
    places.push({
      id: `${route.id}-police-${i}`,
      name,
      type: "police",
      address: "Along the route corridor",
      distanceKm: +(0.4 + i * 0.6).toFixed(1),
      ...p,
    });
  });

  NEARBY_HOSPITAL_NAMES.forEach((name, i) => {
    const p = jitterPoint(midpoint, 0.012, i + 4);
    places.push({
      id: `${route.id}-hospital-${i}`,
      name,
      type: "hospital",
      address: "Near the route",
      distanceKm: +(0.8 + i * 0.7).toFixed(1),
      ...p,
    });
  });

  NEARBY_SAFE_PLACE_NAMES.forEach((name, i) => {
    const p = jitterPoint(midpoint, 0.012, i + 8);
    places.push({
      id: `${route.id}-safe-${i}`,
      name,
      type: "safe-place",
      address: "Open 24 hours",
      distanceKm: +(0.3 + i * 0.5).toFixed(1),
      ...p,
    });
  });

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

export function getReportsAlongRoute(route: RouteOption): CommunityReport[] {
  return COMMUNITY_REPORTS.slice(0, route.alertsCount);
}

import { distanceKm } from "@/services/wsiEngine";
import type { InfrastructurePoint } from "@/services/infrastructureService";

export function findNearestByType(
  location: { lat: number; lng: number },
  points: InfrastructurePoint[],
  type: InfrastructurePoint["type"]
): (InfrastructurePoint & { distanceKm: number }) | null {
  let nearest: (InfrastructurePoint & { distanceKm: number }) | null = null;

  for (const point of points) {
    if (point.type !== type) continue;
    const d = distanceKm(location, point);
    if (!nearest || d < nearest.distanceKm) {
      nearest = { ...point, distanceKm: d };
    }
  }

  return nearest;
}

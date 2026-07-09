import type { MapRoutePoint } from "@/components/shared/MapView";

export interface RouteOption {
  id: string;
  label: string;
  durationMin: number;
  distanceKm: number;
  wsi: number;
  alertsCount: number;
  recommended: boolean;
  highlights: string[];
  path: MapRoutePoint[];
}

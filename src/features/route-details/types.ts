import type { MapMarkerType } from "@/components/shared/MapView";

export interface NearbyPlace {
  id: string;
  name: string;
  type: Extract<MapMarkerType, "police" | "hospital" | "safe-place">;
  address: string;
  distanceKm: number;
  lat: number;
  lng: number;
}

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  distanceKm: number;
  level: "safe" | "caution" | "risk";
}

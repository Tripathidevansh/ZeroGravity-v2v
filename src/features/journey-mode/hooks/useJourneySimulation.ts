import { useEffect, useMemo, useRef, useState } from "react";
import type { RouteOption } from "@/features/route-recommendation/types";
import { getReportsAlongRoute } from "@/features/route-details/mockData";
import type { CommunityReport } from "@/features/community-reports/types";

export interface JourneySimulationState {
  progress: number; // 0–1
  distanceRemainingKm: number;
  etaMin: number;
  currentSafetyScore: number;
  visibleAlerts: CommunityReport[];
  isComplete: boolean;
}

// Full journey plays out over this many seconds of real time, regardless of
// the route's actual duration — keeps the demo lively without a long wait.
const SIMULATED_DURATION_SECONDS = 45;
const TICK_MS = 1000;

export function useJourneySimulation(route: RouteOption | null): JourneySimulationState {
  const [progress, setProgress] = useState(0);
  const allAlerts = useMemo(() => (route ? getReportsAlongRoute(route) : []), [route]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    setProgress(0);
    if (!route) return;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => Math.min(1, prev + 1 / SIMULATED_DURATION_SECONDS));
    }, TICK_MS);

    return () => clearInterval(intervalRef.current);
  }, [route]);

  useEffect(() => {
    if (progress >= 1 && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [progress]);

  if (!route) {
    return {
      progress: 0,
      distanceRemainingKm: 0,
      etaMin: 0,
      currentSafetyScore: 0,
      visibleAlerts: [],
      isComplete: false,
    };
  }

  const distanceRemainingKm = +(route.distanceKm * (1 - progress)).toFixed(1);
  const etaMin = Math.max(0, Math.round(route.durationMin * (1 - progress)));
  // Gentle live jitter around the route's WSI, without crossing safety bands.
  const jitter = Math.round(Math.sin(progress * 12) * 2);
  const currentSafetyScore = Math.max(30, Math.min(99, route.wsi + jitter));
  const alertsToShow = Math.min(allAlerts.length, Math.ceil(progress * allAlerts.length));
  const visibleAlerts = allAlerts.slice(0, alertsToShow);

  return {
    progress,
    distanceRemainingKm,
    etaMin,
    currentSafetyScore,
    visibleAlerts,
    isComplete: progress >= 1,
  };
}

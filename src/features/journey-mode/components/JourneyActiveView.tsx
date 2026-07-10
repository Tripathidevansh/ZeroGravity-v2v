import { Navigation2, Clock, MapPin, PartyPopper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapView } from "@/components/shared/MapView";
import { WSIScore } from "@/components/shared/WSIScore";
import { EmptyState } from "@/components/ui/EmptyState";
import { RouteTimeline } from "@/features/route-details/components/RouteTimeline";
import { getNearbyPlaces, getRouteTimeline } from "@/features/route-details/mockData";
import { useReports } from "@/features/community-reports/api/useReports";
import { useInfrastructurePoints } from "@/services/infrastructureService";
import { EmergencyButton } from "@/features/journey-mode/components/EmergencyButton";
import { useJourneySimulation } from "@/features/journey-mode/hooks/useJourneySimulation";
import { formatDistanceKm, formatDurationMin } from "@/utils/formatting";
import type { RouteOption } from "@/features/route-recommendation/types";

export interface JourneyActiveViewProps {
  route: RouteOption;
  /** Called when the journey ends — `completed` is true on natural arrival,
   * false when the user manually ends the journey early. */
  onEndJourney: (completed: boolean) => void;
}

export function JourneyActiveView({ route, onEndJourney }: JourneyActiveViewProps) {
  const { data: reports } = useReports();
  const { data: infrastructure } = useInfrastructurePoints();
  const sim = useJourneySimulation(route, reports ?? []);
  const nearbyPlaces = getNearbyPlaces(route, infrastructure ?? []);
  const timeline = getRouteTimeline(route);
  const markers = nearbyPlaces.map((p) => ({ id: p.id, type: p.type, name: p.name, lat: p.lat, lng: p.lng }));

  if (sim.isComplete) {
    return (
      <EmptyState
        icon={<PartyPopper size={32} />}
        title="Journey completed"
        description={`You arrived safely. Final safety score for this trip: ${route.wsi}.`}
        action={
          <Button size="sm" onClick={() => onEndJourney(true)}>
            Start a new journey
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="flex flex-col gap-5 lg:col-span-2">
        <Card className="p-0 overflow-hidden">
          <MapView
            center={route.path[Math.floor(route.path.length / 2)]}
            routePath={route.path}
            wsi={route.wsi}
            markers={markers}
            heightClassName="h-64 sm:h-80"
            className="rounded-none border-0"
          />
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <Navigation2 className="mx-auto mb-1.5 text-primary-400" size={18} />
            <p className="text-lg font-semibold text-neutral-50">{formatDistanceKm(sim.distanceRemainingKm)}</p>
            <p className="text-xs text-neutral-500">Remaining</p>
          </Card>
          <Card className="text-center">
            <Clock className="mx-auto mb-1.5 text-secondary-400" size={18} />
            <p className="text-lg font-semibold text-neutral-50">{formatDurationMin(sim.etaMin)}</p>
            <p className="text-xs text-neutral-500">ETA</p>
          </Card>
          <Card className="flex flex-col items-center justify-center">
            <WSIScore score={sim.currentSafetyScore} size="sm" />
            <p className="mt-1 text-xs text-neutral-500">Live safety score</p>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Journey timeline</CardTitle>
              <CardDescription>Live progress along {route.label}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <RouteTimeline steps={timeline} progress={sim.progress} />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-5">
        <EmergencyButton />

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Nearby alerts</CardTitle>
              <CardDescription>Reports along your route</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {sim.visibleAlerts.length === 0 ? (
              <p className="text-sm text-neutral-500">No alerts along this route yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {sim.visibleAlerts.map((alert) => (
                  <li key={alert.id} className="flex items-start gap-2.5">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-caution-500" />
                    <div>
                      <p className="text-sm font-medium text-neutral-100">{alert.title}</p>
                      <p className="text-xs text-neutral-500">{alert.location}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Button variant="outline" onClick={() => onEndJourney(false)}>
          End journey
        </Button>
      </div>
    </div>
  );
}

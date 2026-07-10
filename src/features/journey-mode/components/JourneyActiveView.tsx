import { Navigation2, Clock, MapPin, PartyPopper, LocateFixed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MapView } from "@/components/shared/MapView";
import { WSIScore } from "@/components/shared/WSIScore";
import { EmptyState } from "@/components/ui/EmptyState";
import { RouteTimeline } from "@/features/route-details/components/RouteTimeline";
import { getNearbyPlaces, getRouteTimeline } from "@/features/route-details/mockData";
import { useReports } from "@/features/community-reports/api/useReports";
import { useNearbyPlaces } from "@/services/infrastructureService";
import { EmergencySOSButton } from "@/features/emergency-sos/components/EmergencySOSButton";
import { useJourneySimulation } from "@/features/journey-mode/hooks/useJourneySimulation";
import { useLiveJourneyTracking } from "@/features/journey-mode/hooks/useLiveJourneyTracking";
import { formatDistanceKm, formatDurationMin } from "@/utils/formatting";
import type { RouteOption } from "@/features/route-recommendation/types";

export interface JourneyActiveViewProps {
  route: RouteOption;
  /** The persisted journey row's id, if the journey started successfully —
   * links an Emergency SOS triggered here to this journey, and is required
   * for live GPS tracking to persist updates. */
  journeyId?: string | null;
  /** Called when the journey ends — `completed` is true on natural arrival,
   * false when the user manually ends the journey early. */
  onEndJourney: (completed: boolean) => void;
}

export function JourneyActiveView({ route, journeyId = null, onEndJourney }: JourneyActiveViewProps) {
  const { data: reports } = useReports();
  const routeMidpoint = route.path[Math.floor(route.path.length / 2)];
  const { data: infrastructure } = useNearbyPlaces(routeMidpoint);
  const sim = useJourneySimulation(route, reports ?? []);
  // Starts watching real GPS the moment this view mounts (journey active);
  // the browser watch is cleared automatically when journeyId becomes null
  // or this component unmounts (journey ended).
  const { position: livePosition } = useLiveJourneyTracking(journeyId);
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
          <div className="relative">
            {livePosition && (
              <Badge variant="primary" className="absolute left-3 top-3 z-10 gap-1.5">
                <LocateFixed size={12} className="animate-pulse" />
                Live GPS
              </Badge>
            )}
            <MapView
              center={route.path[Math.floor(route.path.length / 2)]}
              routePath={route.path}
              wsi={route.wsi}
              markers={markers}
              livePosition={livePosition}
              heightClassName="h-64 sm:h-80"
              className="rounded-none border-0"
            />
          </div>
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
        <EmergencySOSButton variant="inline" journeyId={journeyId} />

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

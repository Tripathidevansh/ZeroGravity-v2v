import { useNavigate } from "react-router-dom";
import { ShieldAlert, Clock, Navigation2, Phone, PhoneCall } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MapView } from "@/components/shared/MapView";
import { NearbyPlaceList } from "@/features/route-details/components/NearbyPlaceList";
import { useActiveEmergency, useResolveEmergency } from "@/features/emergency-sos/api/useEmergency";
import { EmergencyTimeline } from "@/features/emergency-sos/components/EmergencyTimeline";
import { useLiveClock, useElapsedTime } from "@/features/emergency-sos/hooks/useLiveClock";
import { EMERGENCY_HELPLINES } from "@/features/emergency-sos/constants";
import { useNearbyPlaces } from "@/services/infrastructureService";
import { distanceKm } from "@/services/wsiEngine";
import { useActiveJourney } from "@/features/journey-mode/api/useJourneys";
import { useToast } from "@/contexts/ToastContext";
import { formatDistanceKm } from "@/utils/formatting";
import { ROUTES } from "@/routes/paths";

export default function EmergencyDashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: emergency, isLoading, refetch } = useActiveEmergency();
  const { data: infrastructure } = useNearbyPlaces(emergency ? { lat: emergency.lat, lng: emergency.lng } : null);
  const { data: activeJourney } = useActiveJourney();
  const resolveEmergency = useResolveEmergency();
  const clock = useLiveClock();

  if (isLoading) {
    return (
      <PageWrapper className="py-0">
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" label="Loading emergency status" />
        </div>
      </PageWrapper>
    );
  }

  if (!emergency) {
    return (
      <PageWrapper className="py-0">
        <EmptyState
          icon={<ShieldAlert size={32} />}
          title="No active emergency"
          description="There's no Emergency SOS currently active on your account."
          action={
            <Button size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}>
              Back to dashboard
            </Button>
          }
        />
      </PageWrapper>
    );
  }

  const emergencyLocation = { lat: emergency.lat, lng: emergency.lng };
  const nearbyPlaces = (infrastructure ?? [])
    .map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      address: p.address,
      lat: p.lat,
      lng: p.lng,
      distanceKm: Math.round(distanceKm(emergencyLocation, p) * 10) / 10,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 6);

  const markers = nearbyPlaces.map((p) => ({ id: p.id, type: p.type, name: p.name, lat: p.lat, lng: p.lng }));

  const handleResolve = async () => {
    try {
      await resolveEmergency.mutateAsync(emergency.id);
      showToast({ variant: "success", title: "Emergency resolved", description: "Glad you're safe." });
      refetch();
    } catch (err) {
      showToast({
        variant: "error",
        title: "Couldn't resolve emergency",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  return (
    <PageWrapper className="py-0">
      <SectionHeader
        title="Emergency Dashboard"
        description="Your live emergency status and nearby help."
        action={
          <Badge variant={emergency.status === "active" ? "risk" : "safe"}>
            {emergency.status === "active" ? "SOS Active" : "Resolved"}
          </Badge>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card variant="glass" className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-risk-500/12 text-red-400">
                <Clock size={20} />
              </span>
              <div>
                <p className="text-xs text-neutral-500">Time elapsed</p>
                <p className="font-display text-xl font-semibold text-neutral-50">
                  <ElapsedTimeDisplay sinceIso={emergency.triggered_at} />
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">Live clock</p>
              <p className="font-display text-xl font-semibold text-neutral-50">
                {clock.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <MapView
              center={emergencyLocation}
              markers={markers}
              heightClassName="h-64 sm:h-80"
              className="rounded-none border-0"
            />
          </Card>

          {activeJourney && (
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Current journey</CardTitle>
                  <CardDescription>Active when SOS was triggered</CardDescription>
                </div>
                <Navigation2 className="text-secondary-400" size={18} />
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-neutral-100">{activeJourney.destination_name}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {formatDistanceKm(Number(activeJourney.distance_km))} · WSI {activeJourney.wsi_score}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Emergency timeline</CardTitle>
                <CardDescription>Everything logged since activation</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <EmergencyTimeline entries={emergency.timeline} />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          {emergency.status === "active" && (
            <Button variant="outline" onClick={handleResolve} isLoading={resolveEmergency.isPending}>
              <ShieldAlert size={16} />
              Mark as resolved
            </Button>
          )}

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Nearby help</CardTitle>
                <CardDescription>Police, hospitals &amp; safe places</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {nearbyPlaces.length === 0 ? (
                <p className="text-sm text-neutral-500">No verified infrastructure points found nearby.</p>
              ) : (
                <NearbyPlaceList places={nearbyPlaces} />
              )}
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <div>
                <CardTitle>Emergency helplines</CardTitle>
                <CardDescription>Tap to call</CardDescription>
              </div>
              <PhoneCall className="text-risk-400" size={18} />
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {EMERGENCY_HELPLINES.map((line) => (
                <a
                  key={line.number}
                  href={`tel:${line.number}`}
                  className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-white/[0.05]"
                >
                  <span className="text-neutral-300">{line.label}</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-neutral-100">
                    <Phone size={13} />
                    {line.number}
                  </span>
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}

function ElapsedTimeDisplay({ sinceIso }: { sinceIso: string }) {
  const elapsed = useElapsedTime(sinceIso);
  return <>{elapsed}</>;
}

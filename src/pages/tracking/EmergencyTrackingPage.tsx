import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertTriangle, Clock, ShieldAlert, Navigation2, MapPinned, ExternalLink } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MapView } from "@/components/shared/MapView";
import { WSIScore } from "@/components/shared/WSIScore";
import { NearbyPlaceList } from "@/features/route-details/components/NearbyPlaceList";
import { EmergencyTimeline } from "@/features/emergency-sos/components/EmergencyTimeline";
import { useElapsedTime, useLiveClock } from "@/features/emergency-sos/hooks/useLiveClock";
import { fetchTrackingSnapshot, type TrackingSnapshot } from "@/features/emergency-sos/api/trackingService";
import { emergencyTrackingChannelName, type EmergencyLocationBroadcastPayload } from "@/features/emergency-sos/hooks/useEmergencyLocationBroadcast";
import { useNearbyPlaces } from "@/services/infrastructureService";
import { distanceKm } from "@/services/wsiEngine";
import { supabase } from "@/services/supabaseClient";
import { formatDistanceKm } from "@/utils/formatting";

const SNAPSHOT_REFRESH_MS = 15000; // catches status/timeline changes the broadcast channel doesn't carry

export default function EmergencyTrackingPage() {
  const { trackingToken } = useParams<{ trackingToken: string }>();
  const [snapshot, setSnapshot] = useState<TrackingSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [livePosition, setLivePosition] = useState<{ lat: number; lng: number; heading?: number | null } | null>(null);
  const clock = useLiveClock();

  // Initial + periodic snapshot fetch — the only place this page reads
  // Supabase data, entirely through the service-role edge function.
  useEffect(() => {
    if (!trackingToken) {
      setError("This tracking link is missing a valid token.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchTrackingSnapshot(trackingToken);
        if (cancelled) return;
        setSnapshot(data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "This tracking link is invalid or has expired.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();
    const interval = setInterval(load, SNAPSHOT_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [trackingToken]);

  // Live location — Realtime Broadcast, not gated by table RLS, so this
  // works for a fully anonymous visitor.
  useEffect(() => {
    if (!trackingToken) return;

    const channel = supabase.channel(emergencyTrackingChannelName(trackingToken));
    channel
      .on("broadcast", { event: "location" }, ({ payload }: { payload: EmergencyLocationBroadcastPayload }) => {
        setLivePosition({ lat: payload.lat, lng: payload.lng, heading: payload.heading });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trackingToken]);

  const { data: infrastructure } = useNearbyPlaces(
    livePosition ?? (snapshot ? { lat: snapshot.emergency.lat, lng: snapshot.emergency.lng } : null)
  );

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex justify-center py-24">
          <LoadingSpinner size="lg" label="Loading tracking information" />
        </div>
      </PageWrapper>
    );
  }

  if (error || !snapshot) {
    return (
      <PageWrapper>
        <EmptyState
          icon={<AlertTriangle size={32} />}
          title="Tracking link unavailable"
          description={error ?? "This tracking link is invalid or has expired."}
        />
      </PageWrapper>
    );
  }

  const { emergency, journey, ownerName } = snapshot;
  const currentLocation = livePosition ?? {
    lat: emergency.current_lat ?? emergency.lat,
    lng: emergency.current_lng ?? emergency.lng,
  };
  const googleMapsLink = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;

  const remainingKm =
    emergency.destination_lat !== null && emergency.destination_lng !== null
      ? distanceKm(currentLocation, { lat: emergency.destination_lat, lng: emergency.destination_lng })
      : null;

  const nearbyPlaces = (infrastructure ?? [])
    .map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      address: p.address,
      lat: p.lat,
      lng: p.lng,
      distanceKm: Math.round(distanceKm(currentLocation, p) * 10) / 10,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 6);

  const markers = nearbyPlaces.map((p) => ({ id: p.id, type: p.type, name: p.name, lat: p.lat, lng: p.lng }));

  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-neutral-50 sm:text-3xl">
              Emergency Tracking
            </h1>
            <p className="mt-1 text-neutral-400">
              {ownerName} activated Emergency SOS and shared this link with you.
            </p>
          </div>
          <Badge variant={emergency.status === "active" ? "risk" : "safe"}>
            {emergency.status === "active" ? "SOS Active" : "Resolved"}
          </Badge>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="flex flex-col gap-5 lg:col-span-2">
            <Card variant="glass" className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-risk-500/12 text-red-400">
                  <Clock size={20} />
                </span>
                <div>
                  <p className="text-xs text-neutral-500">Time since activation</p>
                  <p className="font-display text-xl font-semibold text-neutral-50">
                    <ElapsedTimeDisplay sinceIso={emergency.triggered_at} />
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-500">Your local time</p>
                <p className="font-display text-xl font-semibold text-neutral-50">
                  {clock.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
              </div>
            </Card>

            <Card className="overflow-hidden p-0">
              <MapView
                center={currentLocation}
                livePosition={livePosition}
                markers={markers}
                heightClassName="h-64 sm:h-80"
                className="rounded-none border-0"
              />
            </Card>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Card className="text-center">
                <WSIScore score={emergency.wsi_score ?? 0} size="sm" />
                <p className="mt-1 text-xs text-neutral-500">Safety index</p>
              </Card>
              {remainingKm !== null && (
                <Card className="text-center">
                  <Navigation2 className="mx-auto mb-1.5 text-secondary-400" size={18} />
                  <p className="text-lg font-semibold text-neutral-50">{formatDistanceKm(remainingKm)}</p>
                  <p className="text-xs text-neutral-500">To destination</p>
                </Card>
              )}
              <Card className="text-center">
                <ShieldAlert className="mx-auto mb-1.5 text-red-400" size={18} />
                <p className="text-lg font-semibold text-neutral-50">{journey?.status ?? emergency.journey_status ?? "N/A"}</p>
                <p className="text-xs text-neutral-500">Journey status</p>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Emergency details</CardTitle>
                  <CardDescription>Captured at activation</CardDescription>
                </div>
                <MapPinned className="text-primary-400" size={18} />
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-neutral-500">Address</p>
                  <p className="mt-0.5 text-sm font-medium text-neutral-100">{emergency.address ?? "Unavailable"}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Destination</p>
                  <p className="mt-0.5 text-sm font-medium text-neutral-100">{emergency.destination_name ?? "N/A"}</p>
                </div>
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="col-span-full inline-flex items-center gap-1.5 text-sm font-medium text-secondary-400 hover:text-secondary-300"
                >
                  <ExternalLink size={13} />
                  Open current location in Google Maps
                </a>
              </CardContent>
            </Card>

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
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Nearby help</CardTitle>
                  <CardDescription>Police, hospitals &amp; safe places</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {nearbyPlaces.length === 0 ? (
                  <p className="text-sm text-neutral-500">No verified places found nearby.</p>
                ) : (
                  <NearbyPlaceList places={nearbyPlaces} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function ElapsedTimeDisplay({ sinceIso }: { sinceIso: string }) {
  const elapsed = useElapsedTime(sinceIso);
  return <>{elapsed}</>;
}

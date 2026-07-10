import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { ShieldAlert, Clock, Navigation2, Phone, PhoneCall, MapPinned, BatteryMedium, ExternalLink, Mail, Copy, LocateFixed, Camera, Download, ZoomIn } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MapView } from "@/components/shared/MapView";
import { WSIScore } from "@/components/shared/WSIScore";
import { NearbyPlaceList } from "@/features/route-details/components/NearbyPlaceList";
import { useActiveEmergency, useResolveEmergency } from "@/features/emergency-sos/api/useEmergency";
import { useEmergencyLocationBroadcast } from "@/features/emergency-sos/hooks/useEmergencyLocationBroadcast";
import { EmergencyTimeline } from "@/features/emergency-sos/components/EmergencyTimeline";
import { useLiveClock, useElapsedTime } from "@/features/emergency-sos/hooks/useLiveClock";
import { EMERGENCY_HELPLINES } from "@/features/emergency-sos/constants";
import { useNearbyPlaces } from "@/services/infrastructureService";
import { useReports } from "@/features/community-reports/api/useReports";
import { computeWSI, distanceKm } from "@/services/wsiEngine";
import { supabase } from "@/services/supabaseClient";
import { useToast } from "@/contexts/ToastContext";
import { formatDistanceKm } from "@/utils/formatting";
import { emergencyTrackingPath, ROUTES } from "@/routes/paths";

export default function EmergencyDashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: emergency, isLoading, refetch } = useActiveEmergency();
  const { position: livePosition } = useEmergencyLocationBroadcast(
    emergency?.id ?? null,
    emergency?.tracking_token ?? null
  );

  // Owner's own row — RLS already permits this read, so a real
  // postgres_changes subscription works here (unlike the public tracking
  // page, which uses Broadcast instead since RLS blocks anonymous reads).
  useEffect(() => {
    if (!emergency) return;
    const channel = supabase
      .channel(`emergency-owner-${emergency.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "emergency_events", filter: `id=eq.${emergency.id}` },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [emergency?.id, refetch]);

  const currentLocation = livePosition ?? (emergency ? { lat: emergency.lat, lng: emergency.lng } : null);
  const { data: infrastructure } = useNearbyPlaces(currentLocation);
  const { data: reports } = useReports();
  const resolveEmergency = useResolveEmergency();
  const clock = useLiveClock();
  const [copied, setCopied] = useState(false);

  // ── SOS photo captures for this event ─────────────────────────────────
  interface CaptureRow {
    id: string;
    public_url: string | null;
    storage_path: string;
    trigger_type: string;
    captured_at: string;
  }
  const [captures, setCaptures] = useState<CaptureRow[]>([]);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!emergency?.id) return;
    supabase
      .from("sos_photo_captures")
      .select("id, public_url, storage_path, trigger_type, captured_at")
      .eq("emergency_event_id", emergency.id)
      .order("captured_at", { ascending: false })
      .then(({ data }) => {
        if (data) setCaptures(data as CaptureRow[]);
      });
  }, [emergency?.id]);

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

  const emergencyLocation = currentLocation ?? { lat: emergency.lat, lng: emergency.lng };
  const googleMapsLink = `https://www.google.com/maps?q=${emergencyLocation.lat},${emergencyLocation.lng}`;
  const trackingLink = `${window.location.origin}${emergencyTrackingPath(emergency.tracking_token)}`;

  const liveWsi =
    reports && infrastructure
      ? computeWSI(
          emergencyLocation,
          reports
            .filter((r) => r.lat !== undefined && r.lng !== undefined)
            .map((r) => ({ lat: r.lat!, lng: r.lng!, severity: r.severity, createdAt: r.reportedAt })),
          infrastructure.map((p) => ({ lat: p.lat, lng: p.lng, type: p.type }))
        )
      : null;

  const remainingKm =
    emergency.destination_lat !== null && emergency.destination_lng !== null
      ? distanceKm(emergencyLocation, { lat: emergency.destination_lat, lng: emergency.destination_lng })
      : null;

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

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(trackingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <div className="relative">
              {livePosition && (
                <Badge variant="primary" className="absolute left-3 top-3 z-10 gap-1.5">
                  <LocateFixed size={12} className="animate-pulse" />
                  Live GPS
                </Badge>
              )}
              <MapView
                center={emergencyLocation}
                livePosition={livePosition}
                markers={markers}
                heightClassName="h-64 sm:h-80"
                className="rounded-none border-0"
              />
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {liveWsi !== null && (
              <Card className="flex flex-col items-center justify-center text-center">
                <WSIScore score={liveWsi} size="sm" />
                <p className="mt-1 text-xs text-neutral-500">Live safety index</p>
              </Card>
            )}
            {remainingKm !== null && (
              <Card className="text-center">
                <Navigation2 className="mx-auto mb-1.5 text-secondary-400" size={18} />
                <p className="text-lg font-semibold text-neutral-50">{formatDistanceKm(remainingKm)}</p>
                <p className="text-xs text-neutral-500">Remaining to destination</p>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Emergency record</CardTitle>
                <CardDescription>Everything captured at activation</CardDescription>
              </div>
              <MapPinned className="text-primary-400" size={18} />
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailRow label="Address" value={emergency.address ?? "Unavailable"} />
              <DetailRow label="Coordinates" value={`${emergency.lat.toFixed(5)}, ${emergency.lng.toFixed(5)}`} />
              <DetailRow label="Destination" value={emergency.destination_name ?? "Not on an active journey"} />
              <DetailRow label="Journey status" value={emergency.journey_status ?? "N/A"} />
              <DetailRow label="Women Safety Index" value={emergency.wsi_score !== null ? String(emergency.wsi_score) : "N/A"} />
              <DetailRow
                label="Battery level"
                value={emergency.battery_level !== null ? `${emergency.battery_level}%` : "Unavailable"}
                icon={<BatteryMedium size={13} />}
              />
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noreferrer"
                className="col-span-full inline-flex items-center gap-1.5 text-sm font-medium text-secondary-400 hover:text-secondary-300"
              >
                <ExternalLink size={13} />
                Open exact location in Google Maps
              </a>
            </CardContent>
          </Card>

          {/* ── SOS Photo Captures ──────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>SOS Photo Captures</CardTitle>
                <CardDescription>
                  {captures.length === 0
                    ? "No photos captured yet"
                    : `${captures.length} photo${captures.length > 1 ? "s" : ""} captured at activation`}
                </CardDescription>
              </div>
              <Camera className="text-primary-400" size={18} />
            </CardHeader>
            <CardContent>
              {captures.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Photos are captured automatically when SOS is triggered. If none appear, ensure camera permission was granted before activation.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {captures.map((cap) => (
                    <div key={cap.id} className="group relative overflow-hidden rounded-xl border border-white/10">
                      {cap.public_url ? (
                        <>
                          <img
                            src={cap.public_url}
                            alt={`SOS capture — ${new Date(cap.captured_at).toLocaleTimeString()}`}
                            className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <button
                              onClick={() => setLightboxUrl(cap.public_url)}
                              className="rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/30"
                              title="View full size"
                            >
                              <ZoomIn size={16} className="text-white" />
                            </button>
                            <a
                              href={cap.public_url}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/30"
                              title="Download photo"
                            >
                              <Download size={16} className="text-white" />
                            </a>
                          </div>
                        </>
                      ) : (
                        <div className="flex h-36 w-full items-center justify-center bg-neutral-800/60 text-xs text-neutral-500">
                          Processing…
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                        <span className="text-[10px] text-neutral-400">
                          {new Date(cap.captured_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </span>
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
                          cap.trigger_type === "voice"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-primary-500/15 text-primary-400"
                        }`}>
                          {cap.trigger_type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lightbox */}
          {lightboxUrl && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
              onClick={() => setLightboxUrl(null)}
            >
              <div
                className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={lightboxUrl} alt="SOS capture full size" className="max-h-[90vh] w-full object-contain" />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/60 px-4 py-3 backdrop-blur-sm">
                  <span className="text-sm text-neutral-300">SOS Evidence Photo</span>
                  <div className="flex gap-2">
                    <a
                      href={lightboxUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25"
                    >
                      <Download size={13} /> Download
                    </a>
                    <button
                      onClick={() => setLightboxUrl(null)}
                      className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

          <Card variant="glass">
            <CardHeader>
              <div>
                <CardTitle>Tracking link</CardTitle>
                <CardDescription>Shared with trusted contacts by email</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <button
                onClick={handleCopyLink}
                title="Copy tracking link"
                className="flex w-full items-center justify-between gap-2 rounded-md border border-[var(--color-border-default)] bg-white/[0.02] px-3 py-2.5 text-left text-xs text-neutral-400 hover:bg-white/[0.05]"
              >
                <span className="truncate">{trackingLink}</span>
                <Copy size={14} className="shrink-0" />
              </button>
              {copied && <p className="mt-1.5 text-xs text-safe-400">Copied to clipboard</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Trusted contact alerts</CardTitle>
                <CardDescription>Email delivery status</CardDescription>
              </div>
              <Mail className="text-primary-400" size={18} />
            </CardHeader>
            <CardContent>
              {emergency.notified_contacts.length === 0 ? (
                <p className="text-sm text-neutral-500">No trusted contacts were on file to notify.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {emergency.notified_contacts.map((contact) => (
                    <li key={contact.contactId} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-300">{contact.name}</span>
                      <Badge variant={contact.status === "sent" ? "safe" : "risk"}>
                        {contact.status === "sent" ? "Delivered" : "Failed"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Nearby help</CardTitle>
                <CardDescription>Police, hospitals &amp; safe places</CardDescription>
              </div>
              <Navigation2 className="text-secondary-400" size={18} />
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

function DetailRow({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs text-neutral-500">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-neutral-100">{value}</p>
    </div>
  );
}

function ElapsedTimeDisplay({ sinceIso }: { sinceIso: string }) {
  const elapsed = useElapsedTime(sinceIso);
  return <>{elapsed}</>;
}

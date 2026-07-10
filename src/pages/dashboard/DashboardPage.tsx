import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ShieldCheck, FileWarning, Navigation, Activity, TrendingUp, Users, FileText, Route, Timer, MapPin, LocateFixed } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WSIScore } from "@/components/shared/WSIScore";
import { MapView } from "@/components/shared/MapView";
import { DestinationSearch } from "@/features/destination-search/components/DestinationSearch";
import { ReportCard } from "@/features/community-reports/components/ReportCard";
import { useReports } from "@/features/community-reports/api/useReports";
import { useNearbyPlaces } from "@/services/infrastructureService";
import { useJourneyHistory, useActiveJourney } from "@/features/journey-mode/api/useJourneys";
import { useCommunityStats } from "@/services/communityStatsService";
import { RecentJourneyItem } from "@/features/dashboard/components/RecentJourneyItem";
import { StatTile } from "@/features/dashboard/components/StatTile";
import { EmergencySOSButton } from "@/features/emergency-sos/components/EmergencySOSButton";
import { useRouteSearch } from "@/contexts/RouteSearchContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/contexts/ToastContext";
import { getSafetyLevel, SAFETY_LEVEL_CONFIG } from "@/utils/safety";
import { computeWSI, distanceKm } from "@/services/wsiEngine";
import { ROUTES } from "@/routes/paths";
import type { SavedLocation } from "@/features/destination-search/types";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { searchDestination } = useRouteSearch();
  const { position, isLoading: locationLoading, refresh: refreshLocation } = useGeolocation();

  const { data: reports, isLoading: reportsLoading } = useReports();
  const { data: infrastructure, isLoading: infraLoading } = useNearbyPlaces(position);
  const { data: journeyHistory, isLoading: journeysLoading } = useJourneyHistory(3);
  const { data: activeJourney } = useActiveJourney();
  const { data: communityStats, isLoading: statsLoading } = useCommunityStats();

  const todayScore = useMemo(() => {
    if (!reports || !infrastructure || !position) return null;
    const wsiReports = reports
      .filter((r) => r.lat !== undefined && r.lng !== undefined)
      .map((r) => ({ lat: r.lat!, lng: r.lng!, severity: r.severity, createdAt: r.reportedAt }));
    const wsiInfra = infrastructure.map((p) => ({ lat: p.lat, lng: p.lng, type: p.type }));
    return computeWSI(position, wsiReports, wsiInfra);
  }, [reports, infrastructure, position]);

  const todayLevel = todayScore !== null ? getSafetyLevel(todayScore) : "safe";
  const scoreLabel = SAFETY_LEVEL_CONFIG[todayLevel].label;

  const trendingAlerts = useMemo(
    () => (reports ? [...reports].sort((a, b) => b.verifiedCount - a.verifiedCount).slice(0, 2) : []),
    [reports]
  );

  const nearbySafePlaces = useMemo(() => {
    if (!infrastructure || !position) return [];
    return [...infrastructure]
      .map((p) => ({ ...p, distance: distanceKm(position, p) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [infrastructure, position]);

  const previewMarkers = useMemo(
    () => (infrastructure ?? []).map((p) => ({ id: p.id, type: p.type, name: p.name, lat: p.lat, lng: p.lng })),
    [infrastructure]
  );

  const communityStatTiles = communityStats
    ? [
        { label: "Reports this week", value: String(communityStats.reports_this_week) },
        { label: "Active community members", value: String(communityStats.active_members) },
        { label: "Safer routes chosen", value: String(communityStats.safer_routes_chosen) },
        { label: "Total reports filed", value: String(communityStats.total_reports) },
      ]
    : [];

  const handleSelectDestination = async (location: SavedLocation) => {
    if (!position) {
      showToast({
        variant: "warning",
        title: "Location access needed",
        description: "SafeCircle AI needs your current location to recommend safe routes.",
      });
      refreshLocation();
      return;
    }
    await searchDestination(location, position);
    navigate(ROUTES.ROUTE_RESULTS);
  };

  const locationUnavailable = !locationLoading && !position;

  return (
    <PageWrapper className="py-0">
      {/* Hero */}
      <div
        className="relative mb-6 rounded-2xl border border-[var(--color-border-subtle)] px-6 py-10 sm:px-10 sm:py-12"
        style={{ backgroundImage: "var(--gradient-hero)", backgroundColor: "var(--color-bg-surface)" }}
      >
        <p className="text-lg text-neutral-300 sm:text-xl">{getGreeting()} 👋</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-neutral-50 sm:text-4xl">
          Where are you travelling today?
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-400 sm:text-base">
          <Sparkles size={16} className="text-accent-400" />
          AI is ready to recommend the safest route.
        </p>

        <div className="mt-7 max-w-2xl">
          <DestinationSearch onSelectLocation={handleSelectDestination} proximity={position} />
        </div>

        {locationUnavailable && (
          <button
            onClick={refreshLocation}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-caution-500/30 bg-caution-500/10 px-3 py-2 text-xs font-medium text-caution-400 hover:bg-caution-500/15"
          >
            <LocateFixed size={14} />
            Enable location access to see live safety data
          </button>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's safety score — hero radial */}
        <Card variant="glass" glow className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Today's safety score</CardTitle>
              <CardDescription>Your current area</CardDescription>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/12 text-primary-300">
              <ShieldCheck size={18} />
            </span>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            {locationUnavailable ? (
              <EmptyState
                icon={<LocateFixed size={28} />}
                title="Location access needed"
                description="Enable location to see your area's live safety score."
                action={
                  <Button size="sm" onClick={refreshLocation}>
                    Enable location
                  </Button>
                }
              />
            ) : reportsLoading || infraLoading || todayScore === null ? (
              <LoadingSpinner size="lg" label="Calculating safety score" />
            ) : (
              <>
                <WSIScore score={todayScore} size="hero" />
                <div>
                  <Badge variant={todayLevel}>{scoreLabel}</Badge>
                  <p className="mt-3 max-w-[16rem] text-sm text-neutral-400">
                    Based on recent community reports and verified places within 1.5 km of your live location.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Live map preview */}
        <Card className="lg:col-span-2 overflow-hidden p-0">
          <div className="flex items-center justify-between px-5 pt-5">
            <div>
              <CardTitle>Live area preview</CardTitle>
              <CardDescription>Safe spots &amp; reports near you</CardDescription>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-500/12 text-secondary-400">
              <MapPin size={18} />
            </span>
          </div>
          <div className="mt-4">
            {locationUnavailable ? (
              <div className="flex h-48 items-center justify-center border-t border-[var(--color-border-subtle)] text-sm text-neutral-500">
                Enable location to preview your live area.
              </div>
            ) : !position ? (
              <div className="flex h-48 items-center justify-center border-t border-[var(--color-border-subtle)]">
                <LoadingSpinner size="md" label="Finding your location" />
              </div>
            ) : (
              <MapView
                center={position}
                markers={previewMarkers}
                wsi={todayScore ?? undefined}
                heightClassName="h-48"
                className="rounded-none border-0 border-t border-[var(--color-border-subtle)]"
              />
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Journey status</CardTitle>
              <CardDescription>Live tracking</CardDescription>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-500/12 text-secondary-400">
              <Navigation size={18} />
            </span>
          </CardHeader>
          <CardContent>
            {activeJourney ? (
              <div>
                <p className="text-sm font-medium text-neutral-100">{activeJourney.destination_name}</p>
                <p className="mt-1 text-xs text-neutral-500">In progress · WSI {activeJourney.wsi_score}</p>
              </div>
            ) : (
              <EmptyState title="No active journey" description="Start a journey to see live status here." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Nearby safe places</CardTitle>
              <CardDescription>Police, hospitals &amp; 24/7 spots</CardDescription>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-safe-500/12 text-safe-400">
              <ShieldCheck size={18} />
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {locationUnavailable ? (
              <p className="text-sm text-neutral-500">Enable location to see places near you.</p>
            ) : infraLoading || !position ? (
              <LoadingSpinner size="sm" label="Loading nearby places" />
            ) : nearbySafePlaces.length === 0 ? (
              <p className="text-sm text-neutral-500">No verified places found nearby yet.</p>
            ) : (
              nearbySafePlaces.map((place) => (
                <div key={place.id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-300">{place.name}</span>
                  <span className="text-neutral-500">{place.distance.toFixed(1)} km</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Recent reports</CardTitle>
              <CardDescription>Nearby community reports</CardDescription>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-caution-500/12 text-caution-400">
              <FileWarning size={18} />
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {reportsLoading ? (
              <LoadingSpinner size="sm" label="Loading reports" />
            ) : !reports || reports.length === 0 ? (
              <p className="text-sm text-neutral-500">No reports yet. Be the first to file one.</p>
            ) : (
              reports.slice(0, 2).map((report) => <ReportCard key={report.id} report={report} />)
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Trending alerts</CardTitle>
              <CardDescription>Most-verified reports nearby</CardDescription>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-caution-500/12 text-caution-400">
              <TrendingUp size={18} />
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {trendingAlerts.length === 0 ? (
              <p className="text-sm text-neutral-500">Nothing trending right now.</p>
            ) : (
              trendingAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between gap-2 text-sm">
                  <div>
                    <p className="font-medium text-neutral-100">{alert.title}</p>
                    <p className="text-xs text-neutral-500">{alert.location}</p>
                  </div>
                  <Badge variant="neutral">{alert.verifiedCount} verified</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent journeys</CardTitle>
              <CardDescription>Your last few trips</CardDescription>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] text-neutral-400">
              <Activity size={18} />
            </span>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {journeysLoading ? (
              <LoadingSpinner size="sm" label="Loading journeys" />
            ) : !journeyHistory || journeyHistory.length === 0 ? (
              <p className="text-sm text-neutral-500">No journeys yet — start one from Journey Mode.</p>
            ) : (
              journeyHistory.map((journey) => (
                <RecentJourneyItem
                  key={journey.id}
                  journey={{
                    id: journey.id,
                    destinationName: journey.destination_name,
                    date: journey.started_at,
                    wsi: journey.wsi_score,
                    distanceKm: Number(journey.distance_km),
                  }}
                />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <div>
              <CardTitle>Community statistics</CardTitle>
              <CardDescription>SafeCircle AI's impact this week</CardDescription>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/12 text-primary-300">
              <Users size={18} />
            </span>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statsLoading ? (
              <LoadingSpinner size="sm" label="Loading community stats" />
            ) : (
              communityStatTiles.map((stat, i) => {
                const icons = [FileText, Users, Route, Timer];
                const Icon = icons[i % icons.length];
                return <StatTile key={stat.label} icon={<Icon size={18} />} label={stat.label} value={stat.value} />;
              })
            )}
          </CardContent>
        </Card>
      </div>

      <EmergencySOSButton variant="floating" />
    </PageWrapper>
  );
}

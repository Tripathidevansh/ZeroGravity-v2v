import { useNavigate } from "react-router-dom";
import { Sparkles, ShieldCheck, FileWarning, Navigation, Activity, TrendingUp, Users, FileText, Route, Timer, MapPin } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { WSIScore } from "@/components/shared/WSIScore";
import { MapView } from "@/components/shared/MapView";
import { DestinationSearch } from "@/features/destination-search/components/DestinationSearch";
import { ReportCard } from "@/features/community-reports/components/ReportCard";
import { COMMUNITY_REPORTS } from "@/features/community-reports/mockData";
import {
  TODAY_SAFETY_SCORE,
  RECENT_JOURNEYS,
  NEARBY_SAFE_PLACES,
  COMMUNITY_STATS,
} from "@/features/dashboard/mockData";
import { RecentJourneyItem } from "@/features/dashboard/components/RecentJourneyItem";
import { StatTile } from "@/features/dashboard/components/StatTile";
import { useRouteSearch } from "@/contexts/RouteSearchContext";
import { getSafetyLevel, SAFETY_LEVEL_CONFIG } from "@/utils/safety";
import { DEFAULT_ORIGIN } from "@/features/route-recommendation/mockData";
import { ROUTES } from "@/routes/paths";
import type { SavedLocation } from "@/features/destination-search/types";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// Presentational-only mock markers for the dashboard map preview — jittered
// around the default origin, reusing existing NEARBY_SAFE_PLACES labels.
const PREVIEW_MARKERS = NEARBY_SAFE_PLACES.map((place, i) => ({
  id: place.id,
  type: (i % 2 === 0 ? "safe-place" : "police") as "safe-place" | "police",
  name: place.name,
  lat: DEFAULT_ORIGIN.lat + (i - 1) * 0.006,
  lng: DEFAULT_ORIGIN.lng + (i % 2 === 0 ? 0.005 : -0.005),
}));

export default function DashboardPage() {
  const navigate = useNavigate();
  const { searchDestination } = useRouteSearch();
  const trendingAlerts = [...COMMUNITY_REPORTS].sort((a, b) => b.verifiedCount - a.verifiedCount).slice(0, 2);
  const todayLevel = getSafetyLevel(TODAY_SAFETY_SCORE);
  const scoreLabel = SAFETY_LEVEL_CONFIG[todayLevel].label;

  const handleSelectDestination = (location: SavedLocation) => {
    searchDestination(location);
    navigate(ROUTES.ROUTE_RESULTS);
  };

  return (
    <PageWrapper className="py-0">
      {/* Hero */}
      <div
        className="relative mb-6 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] px-6 py-10 sm:px-10 sm:py-12"
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
          <DestinationSearch onSelectLocation={handleSelectDestination} />
        </div>
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
            <WSIScore score={TODAY_SAFETY_SCORE} size="hero" />
            <div>
              <Badge variant={todayLevel}>{scoreLabel}</Badge>
              <p className="mt-3 max-w-[16rem] text-sm text-neutral-400">
                Based on recent community reports and route activity in your area over the last 24 hours.
              </p>
            </div>
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
            <MapView
              center={DEFAULT_ORIGIN}
              markers={PREVIEW_MARKERS}
              wsi={TODAY_SAFETY_SCORE}
              heightClassName="h-48"
              className="rounded-none border-0 border-t border-[var(--color-border-subtle)]"
            />
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
            <EmptyState title="No active journey" description="Start a journey to see live status here." />
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
            {NEARBY_SAFE_PLACES.map((place) => (
              <div key={place.id} className="flex items-center justify-between text-sm">
                <span className="text-neutral-300">{place.name}</span>
                <span className="text-neutral-500">{place.distanceKm} km</span>
              </div>
            ))}
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
            {COMMUNITY_REPORTS.slice(0, 2).map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
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
            {trendingAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium text-neutral-100">{alert.title}</p>
                  <p className="text-xs text-neutral-500">{alert.location}</p>
                </div>
                <Badge variant="neutral">{alert.verifiedCount} verified</Badge>
              </div>
            ))}
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
            {RECENT_JOURNEYS.map((journey) => (
              <RecentJourneyItem key={journey.id} journey={journey} />
            ))}
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
            {COMMUNITY_STATS.map((stat, i) => {
              const icons = [FileText, Users, Route, Timer];
              const Icon = icons[i % icons.length];
              return <StatTile key={stat.label} icon={<Icon size={18} />} label={stat.label} value={stat.value} />;
            })}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

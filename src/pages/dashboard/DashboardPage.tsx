import { useNavigate } from "react-router-dom";
import { ShieldCheck, FileWarning, Navigation, Activity, TrendingUp, Users, FileText, Route, Timer } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { WSIScore } from "@/components/shared/WSIScore";
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
import { ROUTES } from "@/routes/paths";
import type { SavedLocation } from "@/features/destination-search/types";

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
      <SectionHeader title="Dashboard" description="Your safety overview at a glance." />

      <div className="mb-6">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Search destination</CardTitle>
              <CardDescription>Find the safest route to where you're headed.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DestinationSearch onSelectLocation={handleSelectDestination} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Today's safety score</CardTitle>
              <CardDescription>Your current area</CardDescription>
            </div>
            <ShieldCheck className="text-primary-400" size={18} />
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <WSIScore score={TODAY_SAFETY_SCORE} size="lg" />
            <Badge variant={todayLevel}>{scoreLabel}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent reports</CardTitle>
              <CardDescription>Nearby community reports</CardDescription>
            </div>
            <FileWarning className="text-secondary-400" size={18} />
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
              <CardTitle>Nearby safe places</CardTitle>
              <CardDescription>Police, hospitals & 24/7 spots</CardDescription>
            </div>
            <ShieldCheck className="text-emerald-400" size={18} />
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

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Journey status</CardTitle>
              <CardDescription>Live tracking</CardDescription>
            </div>
            <Navigation className="text-secondary-400" size={18} />
          </CardHeader>
          <CardContent>
            <EmptyState title="No active journey" description="Start a journey to see live status here." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Trending alerts</CardTitle>
              <CardDescription>Most-verified reports nearby</CardDescription>
            </div>
            <TrendingUp className="text-amber-400" size={18} />
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
            <Activity className="text-neutral-500" size={18} />
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {RECENT_JOURNEYS.map((journey) => (
              <RecentJourneyItem key={journey.id} journey={journey} />
            ))}
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Community statistics</CardTitle>
              <CardDescription>SafeCircle AI's impact this week</CardDescription>
            </div>
            <Users className="text-primary-400" size={18} />
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

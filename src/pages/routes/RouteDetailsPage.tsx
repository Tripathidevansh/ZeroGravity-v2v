import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Route as RouteIcon, Navigation2, Sparkles } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MapView } from "@/components/shared/MapView";
import { WSIScore } from "@/components/shared/WSIScore";
import { ReportCard } from "@/features/community-reports/components/ReportCard";
import { RouteTimeline } from "@/features/route-details/components/RouteTimeline";
import { NearbyPlaceList } from "@/features/route-details/components/NearbyPlaceList";
import { getNearbyPlaces, getRouteTimeline, getReportsAlongRoute } from "@/features/route-details/mockData";
import { useReports } from "@/features/community-reports/api/useReports";
import { useInfrastructurePoints } from "@/services/infrastructureService";
import { useRouteExplanation } from "@/features/route-details/api/useRouteExplanation";
import { useRouteSearch } from "@/contexts/RouteSearchContext";
import { formatDistanceKm, formatDurationMin } from "@/utils/formatting";
import { ROUTES } from "@/routes/paths";

export default function RouteDetailsPage() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const { routes, destination, selectRoute } = useRouteSearch();
  const { data: reports } = useReports();
  const { data: infrastructure } = useInfrastructurePoints();

  const route = routes.find((r) => r.id === routeId);
  const explanation = useRouteExplanation(route ?? null, destination?.name ?? "");

  useEffect(() => {
    if (route) selectRoute(route.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  if (!route || !destination) {
    return (
      <PageWrapper className="py-0">
        <EmptyState
          title="Route not found"
          description="This route is no longer available. Search again from your dashboard."
          action={
            <Button size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}>
              Go to dashboard
            </Button>
          }
        />
      </PageWrapper>
    );
  }

  const nearbyPlaces = getNearbyPlaces(route, infrastructure ?? []);
  const timeline = getRouteTimeline(route);
  const reportsOnRoute = getReportsAlongRoute(route, reports ?? []);
  const markers = nearbyPlaces.map((p) => ({ id: p.id, type: p.type, name: p.name, lat: p.lat, lng: p.lng }));

  return (
    <PageWrapper className="py-0">
      <button
        onClick={() => navigate(ROUTES.ROUTE_RESULTS)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100"
      >
        <ArrowLeft size={15} />
        Back to routes
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-neutral-50">{route.label}</h1>
            {route.recommended && <Badge variant="primary">Recommended</Badge>}
          </div>
          <p className="mt-1 text-neutral-400">To {destination.name} · {destination.address}</p>
        </div>
        <Button onClick={() => navigate(ROUTES.JOURNEY)}>
          <Navigation2 size={16} />
          Start journey
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card className="overflow-hidden p-0">
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
              <Clock className="mx-auto mb-1.5 text-secondary-400" size={18} />
              <p className="text-lg font-semibold text-neutral-50">{formatDurationMin(route.durationMin)}</p>
              <p className="text-xs text-neutral-500">Estimated time</p>
            </Card>
            <Card className="text-center">
              <RouteIcon className="mx-auto mb-1.5 text-secondary-400" size={18} />
              <p className="text-lg font-semibold text-neutral-50">{formatDistanceKm(route.distanceKm)}</p>
              <p className="text-xs text-neutral-500">Distance</p>
            </Card>
            <Card className="flex flex-col items-center justify-center">
              <WSIScore score={route.wsi} size="sm" />
              <p className="mt-1 text-xs text-neutral-500">Safety index</p>
            </Card>
          </div>

          <Card variant="glass">
            <CardHeader>
              <div>
                <CardTitle>AI route explanation</CardTitle>
                <CardDescription>Why this route scored the way it did</CardDescription>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/12 text-primary-300">
                <Sparkles size={18} />
              </span>
            </CardHeader>
            <CardContent>
              {explanation.isLoading ? (
                <div className="flex items-center gap-2 py-2 text-neutral-500">
                  <LoadingSpinner size="sm" label="Generating explanation" />
                  Generating explanation…
                </div>
              ) : explanation.isError ? (
                <p className="text-sm text-neutral-500">
                  AI explanation isn't available right now
                  {explanation.error instanceof Error ? `: ${explanation.error.message}` : "."}
                </p>
              ) : (
                <p className="text-sm leading-relaxed text-neutral-300">{explanation.data}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Route timeline</CardTitle>
                <CardDescription>What to expect along the way</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <RouteTimeline steps={timeline} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Community reports on this route</CardTitle>
                <CardDescription>{reportsOnRoute.length} reports along this path</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {reportsOnRoute.length === 0 ? (
                <p className="text-sm text-neutral-500">No reports along this route. Looking good.</p>
              ) : (
                reportsOnRoute.map((report) => <ReportCard key={report.id} report={report} />)
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Nearby safe places</CardTitle>
                <CardDescription>Police, hospitals &amp; 24/7 spots</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {nearbyPlaces.length === 0 ? (
                <p className="text-sm text-neutral-500">No verified infrastructure points found near this route.</p>
              ) : (
                <NearbyPlaceList places={nearbyPlaces} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}

import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { RouteCard } from "@/features/route-recommendation/components/RouteCard";
import { useRouteSearch } from "@/contexts/RouteSearchContext";
import { ROUTES, routeDetailsPath } from "@/routes/paths";
import type { RouteOption } from "@/features/route-recommendation/types";

export default function RouteResultsPage() {
  const navigate = useNavigate();
  const { destination, routes, selectRoute, isSearching, searchError } = useRouteSearch();

  const handleSelect = (route: RouteOption) => {
    selectRoute(route.id);
    navigate(routeDetailsPath(route.id));
  };

  if (isSearching) {
    return (
      <PageWrapper className="py-0">
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" label="Scoring the safest routes" />
        </div>
      </PageWrapper>
    );
  }

  if (searchError) {
    return (
      <PageWrapper className="py-0">
        <EmptyState
          icon={<AlertTriangle size={32} />}
          title="Couldn't score routes"
          description={searchError}
          action={
            <Button size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}>
              Go to dashboard
            </Button>
          }
        />
      </PageWrapper>
    );
  }

  if (!destination) {
    return (
      <PageWrapper className="py-0">
        <EmptyState
          title="No destination selected"
          description="Search for a destination from your dashboard to see safe route options."
          action={
            <Button size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}>
              Go to dashboard
            </Button>
          }
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-0">
      <button
        onClick={() => navigate(ROUTES.DASHBOARD)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100"
      >
        <ArrowLeft size={15} />
        Back to dashboard
      </button>

      <SectionHeader
        title={`Safest routes to ${destination.name}`}
        description={`${destination.address} · ${routes.length} routes compared by safety, not just speed.`}
      />

      <div className="flex flex-col gap-4">
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} onSelect={handleSelect} />
        ))}
      </div>
    </PageWrapper>
  );
}

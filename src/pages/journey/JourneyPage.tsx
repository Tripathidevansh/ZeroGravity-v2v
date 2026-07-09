import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { DestinationSearch } from "@/features/destination-search/components/DestinationSearch";
import { RouteCard } from "@/features/route-recommendation/components/RouteCard";
import { JourneyActiveView } from "@/features/journey-mode/components/JourneyActiveView";
import { useRouteSearch } from "@/contexts/RouteSearchContext";
import type { SavedLocation } from "@/features/destination-search/types";
import type { RouteOption } from "@/features/route-recommendation/types";

export default function JourneyPage() {
  const { destination, routes, selectedRoute, searchDestination, selectRoute, clearSelectedRoute } = useRouteSearch();

  if (selectedRoute) {
    return (
      <PageWrapper className="py-0">
        <SectionHeader title="Journey active" description={`Heading to ${destination?.name ?? "your destination"}`} />
        <JourneyActiveView route={selectedRoute} onEndJourney={clearSelectedRoute} />
      </PageWrapper>
    );
  }

  const handleSelectDestination = (location: SavedLocation) => searchDestination(location);
  const handleSelectRoute = (route: RouteOption) => selectRoute(route.id);

  return (
    <PageWrapper className="py-0">
      <SectionHeader title="Journey mode" description="Start a guided, safety-scored journey." />

      <Card className="mb-6">
        <CardHeader>
          <div>
            <CardTitle>Where are you headed?</CardTitle>
            <CardDescription>Pick a destination to see safe route options.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DestinationSearch onSelectLocation={handleSelectDestination} placeholder="Enter destination" />
        </CardContent>
      </Card>

      {destination && routes.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-400">
            Choose a route to {destination.name} to begin your journey.
          </p>
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} onSelect={handleSelectRoute} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}

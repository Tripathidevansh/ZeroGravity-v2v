import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LocateFixed } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { DestinationSearch } from "@/features/destination-search/components/DestinationSearch";
import { RouteCard } from "@/features/route-recommendation/components/RouteCard";
import { JourneyActiveView } from "@/features/journey-mode/components/JourneyActiveView";
import { useStartJourney, useEndJourney, ACTIVE_JOURNEY_QUERY_KEY } from "@/features/journey-mode/api/useJourneys";
import { createNotification } from "@/features/notifications/api/notificationsService";
import { NOTIFICATIONS_QUERY_KEY } from "@/features/notifications/api/useNotifications";
import { useRouteSearch } from "@/contexts/RouteSearchContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/contexts/ToastContext";
import type { SavedLocation } from "@/features/destination-search/types";
import type { RouteOption } from "@/features/route-recommendation/types";

export default function JourneyPage() {
  const { destination, routes, selectedRoute, searchDestination, selectRoute, clearSelectedRoute } = useRouteSearch();
  const { position, isLoading: locationLoading, refresh: refreshLocation } = useGeolocation();
  const startJourney = useStartJourney();
  const endJourney = useEndJourney();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [activeJourneyId, setActiveJourneyId] = useState<string | null>(null);

  const handleSelectDestination = (location: SavedLocation) => {
    if (!position) {
      showToast({
        variant: "warning",
        title: "Location access needed",
        description: "SafeCircle AI needs your current location to plan a journey.",
      });
      refreshLocation();
      return;
    }
    void searchDestination(location, position);
  };

  const handleSelectRoute = async (route: RouteOption) => {
    selectRoute(route.id);
    if (!destination || !position) return;

    try {
      const journey = await startJourney.mutateAsync({
        destinationName: destination.name,
        destinationLat: destination.lat,
        destinationLng: destination.lng,
        originLat: position.lat,
        originLng: position.lng,
        distanceKm: route.distanceKm,
        durationMin: route.durationMin,
        wsiScore: route.wsi,
      });
      setActiveJourneyId(journey.id);
      queryClient.invalidateQueries({ queryKey: ACTIVE_JOURNEY_QUERY_KEY });

      await createNotification(
        "success",
        "Journey started",
        `Your journey to ${destination.name} has started. Current safety score: ${route.wsi}.`
      );
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    } catch (err) {
      showToast({
        variant: "error",
        title: "Couldn't start journey",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  const handleEndJourney = async (completed: boolean) => {
    if (activeJourneyId) {
      try {
        await endJourney.mutateAsync({ journeyId: activeJourneyId, status: completed ? "completed" : "cancelled" });
        queryClient.invalidateQueries({ queryKey: ACTIVE_JOURNEY_QUERY_KEY });

        if (completed && selectedRoute && destination) {
          await createNotification(
            "success",
            "Journey completed",
            `You arrived safely at ${destination.name}. Trip safety score: ${selectedRoute.wsi}.`
          );
          queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
        }
      } catch (err) {
        showToast({
          variant: "error",
          title: "Couldn't update journey",
          description: err instanceof Error ? err.message : "Please try again.",
        });
      }
    }
    setActiveJourneyId(null);
    clearSelectedRoute();
  };

  if (selectedRoute) {
    return (
      <PageWrapper className="py-0">
        <SectionHeader title="Journey active" description={`Heading to ${destination?.name ?? "your destination"}`} />
        <JourneyActiveView route={selectedRoute} journeyId={activeJourneyId} onEndJourney={handleEndJourney} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-0">
      <SectionHeader title="Journey mode" description="Start a guided, safety-scored journey." />

      {!locationLoading && !position && (
        <div className="mb-6">
          <EmptyState
            icon={<LocateFixed size={28} />}
            title="Location access needed"
            description="SafeCircle AI needs your current location to plan a safe journey."
            action={
              <Button size="sm" onClick={refreshLocation}>
                Enable location
              </Button>
            }
          />
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <div>
            <CardTitle>Where are you headed?</CardTitle>
            <CardDescription>Pick a destination to see safe route options.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DestinationSearch onSelectLocation={handleSelectDestination} placeholder="Enter destination" proximity={position} />
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

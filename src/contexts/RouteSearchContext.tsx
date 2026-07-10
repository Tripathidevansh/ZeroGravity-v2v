import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { SavedLocation } from "@/features/destination-search/types";
import type { RouteOption } from "@/features/route-recommendation/types";
import { generateRoutes } from "@/features/route-recommendation/mockData";
import { fetchReports } from "@/features/community-reports/api/reportsService";
import { REPORTS_QUERY_KEY } from "@/features/community-reports/api/useReports";
import { fetchInfrastructurePoints } from "@/services/infrastructureService";

interface RouteSearchContextValue {
  destination: SavedLocation | null;
  routes: RouteOption[];
  selectedRoute: RouteOption | null;
  isSearching: boolean;
  searchError: string | null;
  searchDestination: (destination: SavedLocation) => Promise<void>;
  selectRoute: (routeId: string) => void;
  clearSelectedRoute: () => void;
}

const RouteSearchContext = createContext<RouteSearchContextValue | undefined>(undefined);

export function RouteSearchProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [destination, setDestination] = useState<SavedLocation | null>(null);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchDestination = useCallback(
    async (dest: SavedLocation) => {
      setIsSearching(true);
      setSearchError(null);
      try {
        // Reuses React Query's cache when fresh, so re-searching a
        // destination shortly after doesn't re-fetch reports/infra.
        const [reports, infrastructure] = await Promise.all([
          queryClient.fetchQuery({ queryKey: REPORTS_QUERY_KEY, queryFn: fetchReports }),
          queryClient.fetchQuery({ queryKey: ["infrastructure-points"], queryFn: fetchInfrastructurePoints }),
        ]);

        setDestination(dest);
        setRoutes(generateRoutes(dest, reports, infrastructure));
        setSelectedRoute(null);
      } catch (err) {
        setSearchError(err instanceof Error ? err.message : "Couldn't compute safe routes. Please try again.");
      } finally {
        setIsSearching(false);
      }
    },
    [queryClient]
  );

  const selectRoute = useCallback(
    (routeId: string) => {
      const match = routes.find((r) => r.id === routeId) ?? null;
      setSelectedRoute(match);
    },
    [routes]
  );

  const clearSelectedRoute = useCallback(() => setSelectedRoute(null), []);

  const value = useMemo(
    () => ({
      destination,
      routes,
      selectedRoute,
      isSearching,
      searchError,
      searchDestination,
      selectRoute,
      clearSelectedRoute,
    }),
    [destination, routes, selectedRoute, isSearching, searchError, searchDestination, selectRoute, clearSelectedRoute]
  );

  return <RouteSearchContext.Provider value={value}>{children}</RouteSearchContext.Provider>;
}

export function useRouteSearch() {
  const ctx = useContext(RouteSearchContext);
  if (!ctx) throw new Error("useRouteSearch must be used within a RouteSearchProvider");
  return ctx;
}

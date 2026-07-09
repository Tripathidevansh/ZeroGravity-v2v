import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { SavedLocation } from "@/features/destination-search/types";
import type { RouteOption } from "@/features/route-recommendation/types";
import { generateRoutes } from "@/features/route-recommendation/mockData";

interface RouteSearchContextValue {
  destination: SavedLocation | null;
  routes: RouteOption[];
  selectedRoute: RouteOption | null;
  searchDestination: (destination: SavedLocation) => void;
  selectRoute: (routeId: string) => void;
  clearSelectedRoute: () => void;
}

const RouteSearchContext = createContext<RouteSearchContextValue | undefined>(undefined);

export function RouteSearchProvider({ children }: { children: ReactNode }) {
  const [destination, setDestination] = useState<SavedLocation | null>(null);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);

  const searchDestination = useCallback((dest: SavedLocation) => {
    setDestination(dest);
    setRoutes(generateRoutes(dest));
    setSelectedRoute(null);
  }, []);

  const selectRoute = useCallback(
    (routeId: string) => {
      const match = routes.find((r) => r.id === routeId) ?? null;
      setSelectedRoute(match);
    },
    [routes]
  );

  const clearSelectedRoute = useCallback(() => setSelectedRoute(null), []);

  const value = useMemo(
    () => ({ destination, routes, selectedRoute, searchDestination, selectRoute, clearSelectedRoute }),
    [destination, routes, selectedRoute, searchDestination, selectRoute, clearSelectedRoute]
  );

  return <RouteSearchContext.Provider value={value}>{children}</RouteSearchContext.Provider>;
}

export function useRouteSearch() {
  const ctx = useContext(RouteSearchContext);
  if (!ctx) throw new Error("useRouteSearch must be used within a RouteSearchProvider");
  return ctx;
}

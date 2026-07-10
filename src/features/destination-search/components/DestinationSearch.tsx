import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { LocationListItem } from "@/features/destination-search/components/LocationListItem";
import { useSavedPlaces } from "@/features/destination-search/api/useSavedPlaces";
import { useJourneyHistory } from "@/features/journey-mode/api/useJourneys";
import { suggestPlaces, retrievePlace, type PlaceSuggestion } from "@/features/destination-search/api/mapboxSearchService";
import type { SavedLocation } from "@/features/destination-search/types";

export interface DestinationSearchProps {
  onSelectLocation: (location: SavedLocation) => void;
  placeholder?: string;
  /** Current GPS position, if available — improves relevance of live search
   * results the same way Google Maps biases suggestions toward you. */
  proximity?: { lat: number; lng: number } | null;
}

const SUGGEST_DEBOUNCE_MS = 300;

export function DestinationSearch({ onSelectLocation, placeholder, proximity }: DestinationSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [liveSuggestions, setLiveSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [retrievingId, setRetrievingId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState(() => crypto.randomUUID());
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: savedPlaceRows, isLoading: savedLoading } = useSavedPlaces();
  const { data: journeyHistory } = useJourneyHistory(5);

  const savedLocations: SavedLocation[] = useMemo(
    () =>
      (savedPlaceRows ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        address: row.address,
        category: row.category,
        lat: row.lat,
        lng: row.lng,
      })),
    [savedPlaceRows]
  );

  // Recent destinations derived from real journey history — deduplicated by
  // destination name, most recent first.
  const recentLocations: SavedLocation[] = useMemo(() => {
    const seen = new Set<string>();
    const result: SavedLocation[] = [];
    for (const journey of journeyHistory ?? []) {
      if (seen.has(journey.destination_name)) continue;
      seen.add(journey.destination_name);
      result.push({
        id: `recent-${journey.id}`,
        name: journey.destination_name,
        address: journey.destination_name,
        category: "custom",
        lat: journey.destination_lat,
        lng: journey.destination_lng,
      });
      if (result.length >= 3) break;
    }
    return result;
  }, [journeyHistory]);

  // Live, unrestricted Mapbox autocomplete — debounced as the user types.
  // Replaces any predefined/mock suggestion list entirely.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setLiveSuggestions([]);
      setIsSuggesting(false);
      return;
    }

    setIsSuggesting(true);
    const timeout = setTimeout(async () => {
      const results = await suggestPlaces(trimmed, sessionToken, proximity ?? undefined);
      setLiveSuggestions(results);
      setIsSuggesting(false);
    }, SUGGEST_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query, sessionToken, proximity]);

  const handleSelectKnown = (location: SavedLocation) => {
    setQuery(location.name);
    setIsOpen(false);
    onSelectLocation(location);
    setSessionToken(crypto.randomUUID());
  };

  const handleSelectSuggestion = async (suggestion: PlaceSuggestion) => {
    setRetrievingId(suggestion.mapboxId);
    const place = await retrievePlace(suggestion.mapboxId, sessionToken);
    setRetrievingId(null);

    if (!place) return;

    setQuery(place.name);
    setIsOpen(false);
    onSelectLocation({
      id: suggestion.mapboxId,
      name: place.name,
      address: place.address,
      category: "custom",
      lat: place.lat,
      lng: place.lng,
    });
    setSessionToken(crypto.randomUUID());
  };

  // Close on outside click only — no onBlur/setTimeout race, so a click on a
  // dropdown item always registers before the dropdown can close.
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const isSearchingText = query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative z-30 w-full">
      <SearchBar
        value={query}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isOpen && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-raised)] shadow-[var(--shadow-elevated)] ring-1 ring-black/20">
          <div className="max-h-96 overflow-y-auto p-2">
            {isSearchingText ? (
              isSuggesting ? (
                <div className="flex justify-center py-6">
                  <LoadingSpinner size="sm" label="Searching" />
                </div>
              ) : liveSuggestions.length > 0 ? (
                liveSuggestions.map((s) => (
                  <button
                    key={s.mapboxId}
                    type="button"
                    onClick={() => handleSelectSuggestion(s)}
                    disabled={retrievingId === s.mapboxId}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-bg-surface-raised)] disabled:opacity-60"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-500/10 text-primary-400">
                      {retrievingId === s.mapboxId ? <LoadingSpinner size="sm" /> : <MapPin size={16} />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-neutral-100">{s.name}</span>
                      <span className="block truncate text-xs text-neutral-500">{s.placeFormatted}</span>
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-4 text-center text-sm text-neutral-500">No matching places found</p>
              )
            ) : savedLoading ? (
              <div className="flex justify-center py-6">
                <LoadingSpinner size="sm" label="Loading your places" />
              </div>
            ) : (
              <>
                {savedLocations.length > 0 && (
                  <SearchSection title="Saved places" locations={savedLocations} onSelect={handleSelectKnown} />
                )}
                {recentLocations.length > 0 && (
                  <SearchSection title="Recent" locations={recentLocations} onSelect={handleSelectKnown} />
                )}
                {savedLocations.length === 0 && recentLocations.length === 0 && (
                  <p className="px-3 py-4 text-center text-sm text-neutral-500">
                    Start typing to search any address, landmark, or place
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchSection({
  title,
  locations,
  onSelect,
}: {
  title: string;
  locations: SavedLocation[];
  onSelect: (location: SavedLocation) => void;
}) {
  return (
    <div className="mb-1 last:mb-0">
      <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
        {title}
      </p>
      {locations.map((loc) => (
        <LocationListItem key={loc.id} location={loc} onSelect={onSelect} />
      ))}
    </div>
  );
}

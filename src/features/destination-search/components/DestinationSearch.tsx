import { useEffect, useMemo, useRef, useState } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { LocationListItem } from "@/features/destination-search/components/LocationListItem";
import {
  RECENT_LOCATIONS,
  SAVED_LOCATIONS,
  SUGGESTED_LOCATIONS,
} from "@/features/destination-search/mockData";
import type { SavedLocation } from "@/features/destination-search/types";

export interface DestinationSearchProps {
  onSelectLocation: (location: SavedLocation) => void;
  placeholder?: string;
}

export function DestinationSearch({ onSelectLocation, placeholder }: DestinationSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const allLocations = useMemo(
    () => [...SAVED_LOCATIONS, ...RECENT_LOCATIONS, ...SUGGESTED_LOCATIONS],
    []
  );

  const filtered = query.trim()
    ? allLocations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query.toLowerCase()) ||
          loc.address.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  const handleSelect = (location: SavedLocation) => {
    setQuery(location.name);
    setIsOpen(false);
    onSelectLocation(location);
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

  return (
    <div ref={containerRef} className="relative z-30 w-full">
      <SearchBar
        value={query}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-raised)] shadow-[var(--shadow-elevated)]">
            <div className="max-h-96 overflow-y-auto p-2">
              {filtered ? (
                filtered.length > 0 ? (
                  filtered.map((loc) => (
                    <LocationListItem key={loc.id} location={loc} onSelect={handleSelect} />
                  ))
                ) : (
                  <p className="px-3 py-4 text-center text-sm text-neutral-500">
                    No matching places found
                  </p>
                )
              ) : (
                <>
                  <SearchSection title="Saved places" locations={SAVED_LOCATIONS} onSelect={handleSelect} />
                  <SearchSection title="Recent" locations={RECENT_LOCATIONS} onSelect={handleSelect} />
                  <SearchSection title="Suggested" locations={SUGGESTED_LOCATIONS} onSelect={handleSelect} />
                </>
              )}
            </div>
          </div>
        </>
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

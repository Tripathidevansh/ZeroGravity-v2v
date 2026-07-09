import { useMemo, useRef, useState } from "react";
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

  return (
    <div ref={containerRef} className="relative w-full">
      <SearchBar
        value={query}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 120)}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isOpen && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-[--radius-lg] border border-[--color-border-subtle] bg-[--color-bg-surface-raised] shadow-[var(--shadow-elevated)]">
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

import { LOCATION_CATEGORY_ICON } from "@/features/destination-search/components/LocationIcon";
import type { SavedLocation } from "@/features/destination-search/types";

export interface LocationListItemProps {
  location: SavedLocation;
  onSelect: (location: SavedLocation) => void;
}

export function LocationListItem({ location, onSelect }: LocationListItemProps) {
  const Icon = LOCATION_CATEGORY_ICON[location.category];

  return (
    <button
      type="button"
      onClick={() => onSelect(location)}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-bg-surface-raised)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-500/10 text-primary-400">
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-neutral-100">{location.name}</span>
        <span className="block truncate text-xs text-neutral-500">{location.address}</span>
      </span>
    </button>
  );
}

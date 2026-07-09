import { Siren, Cross, ShieldCheck } from "lucide-react";
import type { NearbyPlace } from "@/features/route-details/types";

const TYPE_CONFIG = {
  police: { icon: Siren, className: "bg-secondary-500/10 text-secondary-400" },
  hospital: { icon: Cross, className: "bg-red-500/10 text-red-400" },
  "safe-place": { icon: ShieldCheck, className: "bg-safe-500/10 text-emerald-400" },
} as const;

export function NearbyPlaceList({ places }: { places: NearbyPlace[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {places.map((place) => {
        const { icon: Icon, className } = TYPE_CONFIG[place.type];
        return (
          <li key={place.id} className="flex items-center gap-3 rounded-[--radius-md] px-2 py-2 hover:bg-[--color-bg-surface-raised]">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[--radius-md] ${className}`}>
              <Icon size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-100">{place.name}</p>
              <p className="truncate text-xs text-neutral-500">{place.address}</p>
            </div>
            <span className="shrink-0 text-xs text-neutral-500">{place.distanceKm} km</span>
          </li>
        );
      })}
    </ul>
  );
}

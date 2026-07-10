import { Siren, Cross, ShieldCheck, Pill, TrainFront, Fuel } from "lucide-react";
import type { NearbyPlace } from "@/features/route-details/types";

const TYPE_CONFIG = {
  police: { icon: Siren, className: "bg-secondary-50 text-secondary-600" },
  hospital: { icon: Cross, className: "bg-red-50 text-red-600" },
  pharmacy: { icon: Pill, className: "bg-teal-50 text-teal-600" },
  metro: { icon: TrainFront, className: "bg-purple-50 text-purple-600" },
  fuel: { icon: Fuel, className: "bg-amber-50 text-amber-600" },
  "safe-place": { icon: ShieldCheck, className: "bg-emerald-50 text-emerald-600" },
} as const;

export function NearbyPlaceList({ places }: { places: NearbyPlace[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {places.map((place) => {
        const { icon: Icon, className } = TYPE_CONFIG[place.type];
        return (
          <li key={place.id} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-[var(--color-bg-surface-raised)]">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${className}`}>
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

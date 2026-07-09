import { Navigation } from "lucide-react";
import { WSIScore } from "@/components/shared/WSIScore";
import { formatRelativeTime, formatDistanceKm } from "@/utils/formatting";
import type { RecentJourney } from "@/features/dashboard/mockData";

export function RecentJourneyItem({ journey }: { journey: RecentJourney }) {
  return (
    <div className="flex items-center gap-3 rounded-[--radius-md] px-2 py-2 hover:bg-[--color-bg-surface-raised]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[--radius-md] bg-[--color-bg-surface-raised] text-neutral-400">
        <Navigation size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-100">{journey.destinationName}</p>
        <p className="text-xs text-neutral-500">
          {formatRelativeTime(journey.date)} · {formatDistanceKm(journey.distanceKm)}
        </p>
      </div>
      <WSIScore score={journey.wsi} size="sm" />
    </div>
  );
}

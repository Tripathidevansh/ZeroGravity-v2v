import { Clock, Route as RouteIcon, TriangleAlert, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { WSIScore } from "@/components/shared/WSIScore";
import { formatDistanceKm, formatDurationMin } from "@/utils/formatting";
import type { RouteOption } from "@/features/route-recommendation/types";

export interface RouteCardProps {
  route: RouteOption;
  onSelect: (route: RouteOption) => void;
}

export function RouteCard({ route, onSelect }: RouteCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:border-primary-500/40",
        route.recommended && "border-primary-500/40 bg-primary-500/[0.04]"
      )}
      onClick={() => onSelect(route)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <WSIScore score={route.wsi} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-neutral-50">{route.label}</h3>
              {route.recommended && (
                <Badge variant="primary">
                  <Sparkles size={12} />
                  Recommended
                </Badge>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-400">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} />
                {formatDurationMin(route.durationMin)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <RouteIcon size={14} />
                {formatDistanceKm(route.distanceKm)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <TriangleAlert size={14} />
                {route.alertsCount} {route.alertsCount === 1 ? "report" : "reports"}
              </span>
            </div>
            <ul className="mt-3 space-y-1">
              {route.highlights.map((h) => (
                <li key={h} className="text-xs text-neutral-500">
                  • {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ChevronRight size={18} className="mt-1 shrink-0 text-neutral-600" />
      </div>
    </Card>
  );
}

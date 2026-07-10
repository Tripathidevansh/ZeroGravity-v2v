import { cn } from "@/lib/cn";
import { SAFETY_LEVEL_CONFIG } from "@/utils/safety";
import type { TimelineStep } from "@/features/route-details/types";

export interface RouteTimelineProps {
  steps: TimelineStep[];
  /** 0–1 journey progress. When provided, steps behind the marker are shown as completed. */
  progress?: number;
}

export function RouteTimeline({ steps, progress }: RouteTimelineProps) {
  const totalDistance = steps[steps.length - 1]?.distanceKm ?? 0;

  return (
    <ol className="flex flex-col">
      {steps.map((step, i) => {
        const config = SAFETY_LEVEL_CONFIG[step.level];
        const isLast = i === steps.length - 1;
        const isCompleted = progress !== undefined && totalDistance > 0 && step.distanceKm / totalDistance <= progress;

        return (
          <li key={step.id} className={cn("relative flex gap-4 pb-6 last:pb-0", progress !== undefined && !isCompleted && "opacity-50")}>
            {!isLast && (
              <span className="absolute left-[7px] top-4 h-full w-px bg-[var(--color-border-subtle)]" aria-hidden="true" />
            )}
            <span
              className={cn(
                "z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[var(--color-bg-surface)]",
                config.bgClass.replace("/10", ""),
                step.level === "safe" && "bg-safe-500",
                step.level === "caution" && "bg-caution-500",
                step.level === "risk" && "bg-risk-500"
              )}
            />
            <div>
              <p className="text-sm font-medium text-neutral-100">{step.title}</p>
              <p className="text-xs text-neutral-500">{step.description}</p>
              <p className="mt-0.5 text-xs text-neutral-600">{step.distanceKm} km in</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

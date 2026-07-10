import { Circle } from "lucide-react";
import type { TimelineEntry } from "@/features/emergency-sos/types";

export function EmergencyTimeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-neutral-500">No events logged yet.</p>;
  }

  return (
    <ol className="flex flex-col">
      {entries.map((entry, i) => {
        const isLast = i === entries.length - 1;
        return (
          <li key={`${entry.at}-${i}`} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast && (
              <span className="absolute left-[5px] top-3 h-full w-px bg-[var(--color-border-subtle)]" aria-hidden="true" />
            )}
            <Circle size={11} className="z-10 mt-1 shrink-0 fill-risk-500 text-risk-500" />
            <div>
              <p className="text-sm text-neutral-100">{entry.label}</p>
              <p className="text-xs text-neutral-500">
                {new Date(entry.at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

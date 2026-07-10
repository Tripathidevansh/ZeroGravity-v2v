import type { ReactNode } from "react";

export function StatTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border-subtle)] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[image:var(--gradient-primary-accent)] text-white">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-xl font-semibold text-neutral-50">{value}</p>
        <p className="truncate text-xs text-neutral-500">{label}</p>
      </div>
    </div>
  );
}

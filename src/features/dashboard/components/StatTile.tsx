import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export function StatTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Card className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[--radius-md] bg-primary-500/10 text-primary-400">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-lg font-semibold text-neutral-50">{value}</p>
        <p className="truncate text-xs text-neutral-500">{label}</p>
      </div>
    </Card>
  );
}

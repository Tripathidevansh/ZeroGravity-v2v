import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[--radius-xl] border border-dashed",
        "border-[--color-border-default] bg-[--color-bg-surface] px-6 py-12 text-center",
        className
      )}
    >
      {icon && <div className="text-neutral-500">{icon}</div>}
      <h3 className="text-sm font-semibold text-neutral-100">{title}</h3>
      {description && <p className="max-w-sm text-sm text-neutral-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

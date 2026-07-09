import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className
      )}
    >
      <div className={cn(align === "center" && "mx-auto max-w-2xl")}>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-400">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-semibold text-neutral-50 sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-neutral-400">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

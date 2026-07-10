import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "neutral" | "primary" | "safe" | "caution" | "risk";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  neutral: "bg-[var(--color-bg-surface-raised)] text-neutral-200 border-[var(--color-border-subtle)]",
  primary: "bg-primary-50 text-primary-600 border-primary-200",
  safe: "bg-emerald-50 text-emerald-600 border-emerald-200",
  caution: "bg-amber-50 text-amber-600 border-amber-200",
  risk: "bg-red-50 text-red-600 border-red-200",
};

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide",
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

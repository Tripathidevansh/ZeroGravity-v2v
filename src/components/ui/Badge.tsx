import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "neutral" | "primary" | "safe" | "caution" | "risk";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  neutral: "bg-[--color-bg-surface-raised] text-neutral-300 border-[--color-border-default]",
  primary: "bg-primary-500/10 text-primary-300 border-primary-500/30",
  safe: "bg-safe-500/10 text-emerald-400 border-safe-500/30",
  caution: "bg-caution-500/10 text-amber-400 border-caution-500/30",
  risk: "bg-risk-500/10 text-red-400 border-risk-500/30",
};

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[--radius-full] border px-2.5 py-1 text-xs font-medium",
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

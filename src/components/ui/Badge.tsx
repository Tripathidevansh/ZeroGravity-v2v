import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "neutral" | "primary" | "safe" | "caution" | "risk";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  neutral: "bg-white/[0.04] text-neutral-300 border-[var(--color-border-default)]",
  primary: "bg-primary-500/12 text-primary-300 border-primary-500/30",
  safe: "bg-safe-500/12 text-safe-400 border-safe-500/30",
  caution: "bg-caution-500/12 text-caution-400 border-caution-500/30",
  risk: "bg-risk-500/12 text-risk-400 border-risk-500/30",
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

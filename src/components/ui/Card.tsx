import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** "glass" adds a translucent, blurred, glowing-border premium surface. Default is a solid dark card. */
  variant?: "solid" | "glass";
  /** Adds a soft radial brand-color glow bleeding from a corner — use sparingly, on hero/feature cards. */
  glow?: boolean;
}

export function Card({ className, children, variant = "solid", glow = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-6 transition-shadow duration-300",
        variant === "solid" &&
          "border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-raised)] shadow-[var(--shadow-soft)]",
        variant === "glass" && "glass-panel",
        className
      )}
      {...props}
    >
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-60 blur-3xl"
          style={{ backgroundImage: "var(--gradient-radial-fade)" }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-semibold tracking-tight text-neutral-50", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-neutral-400", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-sm text-neutral-300", className)} {...props}>
      {children}
    </div>
  );
}

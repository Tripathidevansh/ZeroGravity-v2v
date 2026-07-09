import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 focus-visible:outline-primary-400 shadow-[var(--shadow-glow-primary)]",
  secondary:
    "bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:outline-secondary-400",
  outline:
    "border border-[--color-border-default] text-neutral-100 hover:bg-[--color-bg-surface-raised] focus-visible:outline-neutral-400",
  ghost: "text-neutral-200 hover:bg-[--color-bg-surface-raised] focus-visible:outline-neutral-400",
  danger: "bg-risk-500 text-white hover:bg-red-600 focus-visible:outline-red-400",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm rounded-[--radius-sm]",
  md: "h-11 px-5 text-sm rounded-[--radius-md]",
  lg: "h-13 px-6 text-base rounded-[--radius-lg]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading = false, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

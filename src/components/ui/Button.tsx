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
    "bg-[image:var(--gradient-primary)] text-white shadow-[var(--shadow-glow-primary)] hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(124,58,237,0.35),0_0_32px_rgba(124,58,237,0.45),0_10px_36px_rgba(124,58,237,0.28)] active:brightness-95",
  secondary:
    "bg-secondary-500 text-white hover:bg-secondary-600 shadow-[var(--shadow-glow-accent)]",
  outline:
    "border border-[var(--color-border-default)] text-neutral-100 bg-white/[0.02] hover:bg-white/[0.06] hover:border-primary-400/50",
  ghost: "text-neutral-300 hover:bg-white/[0.06] hover:text-neutral-50",
  danger: "bg-risk-500 text-white hover:bg-red-600 shadow-[var(--shadow-glow-risk)]",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm rounded-lg",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-13 px-7 text-base rounded-xl",
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
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:shadow-none",
          "active:scale-[0.98]",
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

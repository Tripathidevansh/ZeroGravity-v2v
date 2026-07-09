import { cn } from "@/lib/cn";

const SIZE_MAP = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
} as const;

export interface LoadingSpinnerProps {
  size?: keyof typeof SIZE_MAP;
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = "md", className, label = "Loading" }: LoadingSpinnerProps) {
  return (
    <div role="status" aria-label={label} className="inline-flex items-center justify-center">
      <span
        className={cn(
          "animate-spin rounded-full border-primary-500/30 border-t-primary-500",
          SIZE_MAP[size],
          className
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

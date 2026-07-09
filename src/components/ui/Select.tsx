import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-neutral-200">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            className={cn(
              "h-11 w-full appearance-none rounded-[--radius-md] border bg-[--color-bg-surface-raised] px-3.5 pr-9 text-sm text-neutral-50",
              "outline-none transition-colors",
              "focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30",
              error ? "border-risk-500" : "border-[--color-border-default]",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />
        </div>
        {error && <p className="text-xs text-risk-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

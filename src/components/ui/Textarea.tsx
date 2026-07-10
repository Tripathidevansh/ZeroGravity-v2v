import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-neutral-200">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={!!error}
          className={cn(
            "w-full resize-none rounded-md border bg-[var(--color-bg-surface-raised)] px-3.5 py-2.5 text-sm text-neutral-50",
            "placeholder:text-neutral-500 outline-none transition-colors",
            "focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30",
            error ? "border-risk-500" : "border-[var(--color-border-default)]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-risk-500">{error}</p>}
        {!error && hint && <p className="text-xs text-neutral-500">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

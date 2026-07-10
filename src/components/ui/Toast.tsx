import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type ToastVariant = "success" | "warning" | "error" | "info";

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  onDismiss: (id: string) => void;
}

const VARIANT_CONFIG: Record<ToastVariant, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: "text-emerald-400" },
  warning: { icon: AlertTriangle, className: "text-amber-400" },
  error: { icon: XCircle, className: "text-red-400" },
  info: { icon: Info, className: "text-secondary-400" },
};

export function Toast({ id, title, description, variant = "info", onDismiss }: ToastProps) {
  const { icon: Icon, className } = VARIANT_CONFIG[variant];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div
      role="status"
      className={cn(
        "flex w-full max-w-sm items-start gap-3 rounded-xl border",
        "border-[var(--color-border-subtle)] bg-[var(--color-neutral-950)] p-4 shadow-[var(--shadow-elevated)]"
      )}
    >
      <Icon size={20} className={cn("mt-0.5 shrink-0", className)} />
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-50">{title}</p>
        {description && <p className="mt-0.5 text-xs text-neutral-400">{description}</p>}
      </div>
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="text-neutral-500 hover:text-neutral-200"
      >
        <X size={16} />
      </button>
    </div>
  );
}

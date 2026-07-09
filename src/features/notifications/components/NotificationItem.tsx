import { TriangleAlert, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatRelativeTime } from "@/utils/formatting";
import type { AppNotification, NotificationType } from "@/features/notifications/types";

const TYPE_CONFIG: Record<NotificationType, { icon: typeof TriangleAlert; className: string }> = {
  alert: { icon: TriangleAlert, className: "bg-caution-500/10 text-amber-400" },
  success: { icon: CheckCircle2, className: "bg-safe-500/10 text-emerald-400" },
  safety: { icon: ShieldAlert, className: "bg-risk-500/10 text-red-400" },
  ai: { icon: Sparkles, className: "bg-primary-500/10 text-primary-400" },
};

export function NotificationItem({ notification }: { notification: AppNotification }) {
  const { icon: Icon, className } = TYPE_CONFIG[notification.type];

  return (
    <div className={cn("flex gap-3.5 rounded-[--radius-lg] px-3 py-3", !notification.read && "bg-primary-500/[0.04]")}>
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", className)}>
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-neutral-100">{notification.title}</p>
          {!notification.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />}
        </div>
        <p className="mt-0.5 text-sm text-neutral-500">{notification.message}</p>
        <p className="mt-1.5 text-xs text-neutral-600">{formatRelativeTime(notification.timestamp)}</p>
      </div>
    </div>
  );
}

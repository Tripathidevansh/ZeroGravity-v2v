import { TriangleAlert, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatRelativeTime } from "@/utils/formatting";
import type { AppNotification, NotificationType } from "@/features/notifications/types";

const TYPE_CONFIG: Record<NotificationType, { icon: typeof TriangleAlert; className: string }> = {
  alert: { icon: TriangleAlert, className: "bg-amber-50 text-amber-600" },
  success: { icon: CheckCircle2, className: "bg-emerald-50 text-emerald-600" },
  safety: { icon: ShieldAlert, className: "bg-red-50 text-red-600" },
  ai: { icon: Sparkles, className: "bg-primary-50 text-primary-600" },
};

export function NotificationItem({ notification }: { notification: AppNotification }) {
  const { icon: Icon, className } = TYPE_CONFIG[notification.type];

  return (
    <div className={cn("flex gap-3.5 rounded-xl px-3 py-3", !notification.read && "bg-primary-50/50")}>
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

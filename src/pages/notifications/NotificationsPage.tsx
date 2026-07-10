import { useMemo } from "react";
import { BellOff, AlertTriangle } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import { useNotifications, useMarkAllNotificationsRead } from "@/features/notifications/api/useNotifications";
import type { AppNotification } from "@/features/notifications/types";

export default function NotificationsPage() {
  const { data: rows, isLoading, isError, error, refetch } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications: AppNotification[] = useMemo(
    () =>
      (rows ?? []).map((row) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        message: row.message,
        timestamp: row.created_at,
        read: row.read,
      })),
    [rows]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <PageWrapper className="py-0">
      <SectionHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
        action={
          unreadCount > 0 ? (
            <Button size="sm" variant="outline" onClick={() => markAllRead.mutate()} isLoading={markAllRead.isPending}>
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" label="Loading notifications" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={<AlertTriangle size={32} />}
          title="Couldn't load notifications"
          description={error instanceof Error ? error.message : "Something went wrong. Please try again."}
          action={
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<BellOff size={32} />}
          title="No notifications yet"
          description="Journey updates and nearby safety alerts will show up here."
        />
      ) : (
        <Card className="divide-y divide-[var(--color-border-subtle)] p-2">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </Card>
      )}
    </PageWrapper>
  );
}

import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/ui/Card";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import { NOTIFICATIONS } from "@/features/notifications/mockData";

export default function NotificationsPage() {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <PageWrapper className="py-0">
      <SectionHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
      />
      <Card className="divide-y divide-[--color-border-subtle] p-2">
        {NOTIFICATIONS.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </Card>
    </PageWrapper>
  );
}

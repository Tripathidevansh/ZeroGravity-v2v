import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/features/notifications/api/notificationsService";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;

export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchNotifications,
    enabled,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
  });
}

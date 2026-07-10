import { supabase } from "@/services/supabaseClient";
import type { Database, NotificationTypeRow } from "@/types/database";

export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

export async function fetchNotifications(): Promise<NotificationRow[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function markAllNotificationsRead(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);
  if (error) throw new Error(error.message);
}

/**
 * Inserts a notification for the current user. Used as a lightweight,
 * client-driven substitute for DB triggers (journey started/completed,
 * nearby report, report approved) so this works on any Supabase plan
 * without requiring pg_net/webhooks.
 */
export async function createNotification(type: NotificationTypeRow, title: string, message: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("notifications").insert({
    user_id: user.id,
    type,
    title,
    message,
  });
  if (error) throw new Error(error.message);
}

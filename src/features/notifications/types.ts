export type NotificationType = "alert" | "success" | "safety" | "ai";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO
  read: boolean;
}

import type { AppNotification } from "@/features/notifications/types";

function minutesAgo(min: number): string {
  return new Date(Date.now() - min * 60_000).toISOString();
}

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n-1",
    type: "alert",
    title: "Poor lighting reported nearby",
    message: "A community member reported dim streetlights near Sector 62 flyover, on your usual commute.",
    timestamp: minutesAgo(12),
    read: false,
  },
  {
    id: "n-2",
    type: "safety",
    title: "New safety alert in your area",
    message: "Suspicious activity reported near JIIT back gate. Consider an alternate route after 9 PM.",
    timestamp: minutesAgo(58),
    read: false,
  },
  {
    id: "n-3",
    type: "ai",
    title: "Route recommendation updated",
    message: "Route A to Office is now scoring 91 WSI, up from 84, after 2 new police checkpoints were verified.",
    timestamp: minutesAgo(140),
    read: false,
  },
  {
    id: "n-4",
    type: "success",
    title: "Journey completed",
    message: "You arrived safely at College — JIIT Sector 62. Trip safety score: 94.",
    timestamp: minutesAgo(1560),
    read: true,
  },
  {
    id: "n-5",
    type: "alert",
    title: "Broken streetlights confirmed",
    message: "3 reports of non-functional streetlights in Sector 62, Block C have been verified by the community.",
    timestamp: minutesAgo(2100),
    read: true,
  },
  {
    id: "n-6",
    type: "success",
    title: "Journey completed",
    message: "You arrived safely at Metro Station. Trip safety score: 79.",
    timestamp: minutesAgo(3020),
    read: true,
  },
];

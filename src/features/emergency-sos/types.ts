export interface TimelineEntry {
  at: string; // ISO timestamp
  label: string;
}

export interface NotifiedContactResult {
  contactId: string;
  name: string;
  status: "sent" | "failed";
  sentAt: string; // ISO timestamp
}

export type EmergencyStatus = "active" | "resolved";

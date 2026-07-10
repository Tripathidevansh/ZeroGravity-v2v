export type ReportCategory =
  | "poor-lighting"
  | "harassment"
  | "unsafe-area"
  | "suspicious-activity"
  | "broken-streetlight";

export type ReportSeverity = "low" | "medium" | "high";

export interface CommunityReport {
  id: string;
  category: ReportCategory;
  title: string;
  description: string;
  location: string;
  severity: ReportSeverity;
  reportedAt: string; // ISO date
  verifiedCount: number;
  /** Optional real-data fields — populated once fetched from Supabase. */
  lat?: number;
  lng?: number;
  imageUrl?: string | null;
  status?: "pending" | "approved" | "rejected";
  userId?: string;
}

export const REPORT_CATEGORY_LABEL: Record<ReportCategory, string> = {
  "poor-lighting": "Poor Lighting",
  harassment: "Harassment",
  "unsafe-area": "Unsafe Area",
  "suspicious-activity": "Suspicious Activity",
  "broken-streetlight": "Broken Street Lights",
};

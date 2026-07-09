import { Lightbulb, ShieldAlert, MapPinOff, Eye, LampWallDown } from "lucide-react";
import type { ReportCategory, ReportSeverity } from "@/features/community-reports/types";

export const REPORT_CATEGORY_ICON: Record<ReportCategory, typeof Lightbulb> = {
  "poor-lighting": Lightbulb,
  harassment: ShieldAlert,
  "unsafe-area": MapPinOff,
  "suspicious-activity": Eye,
  "broken-streetlight": LampWallDown,
};

export const SEVERITY_CONFIG: Record<ReportSeverity, { label: string; badgeVariant: "safe" | "caution" | "risk" }> = {
  low: { label: "Low severity", badgeVariant: "safe" },
  medium: { label: "Medium severity", badgeVariant: "caution" },
  high: { label: "High severity", badgeVariant: "risk" },
};

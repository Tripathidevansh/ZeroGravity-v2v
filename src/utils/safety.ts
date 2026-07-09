import type { SafetyLevel } from "@/types";

/**
 * Women Safety Index (WSI) scoring rules.
 * 90–100 → safe (green), 70–89 → caution (yellow), below 70 → risk (red).
 * This is the single source of truth for WSI thresholds — never
 * hardcode these numbers elsewhere.
 */
export function getSafetyLevel(score: number): SafetyLevel {
  if (score >= 90) return "safe";
  if (score >= 70) return "caution";
  return "risk";
}

export const SAFETY_LEVEL_CONFIG: Record<
  SafetyLevel,
  { label: string; textClass: string; bgClass: string; borderClass: string; ringClass: string }
> = {
  safe: {
    label: "Very safe",
    textClass: "text-emerald-400",
    bgClass: "bg-safe-500/10",
    borderClass: "border-safe-500/30",
    ringClass: "stroke-safe-500",
  },
  caution: {
    label: "Use caution",
    textClass: "text-amber-400",
    bgClass: "bg-caution-500/10",
    borderClass: "border-caution-500/30",
    ringClass: "stroke-caution-500",
  },
  risk: {
    label: "Higher risk",
    textClass: "text-red-400",
    bgClass: "bg-risk-500/10",
    borderClass: "border-risk-500/30",
    ringClass: "stroke-risk-500",
  },
};

export function getSafetyLevelConfig(score: number) {
  return SAFETY_LEVEL_CONFIG[getSafetyLevel(score)];
}

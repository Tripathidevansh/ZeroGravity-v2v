import { useId } from "react";
import { cn } from "@/lib/cn";
import { getSafetyLevel, getSafetyLevelConfig } from "@/utils/safety";

export interface WSIScoreProps {
  score: number;
  size?: "sm" | "md" | "lg" | "hero";
  showLabel?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  sm: { box: 44, stroke: 4, text: "text-sm", labelGap: "mt-1 text-[11px]", glow: false },
  md: { box: 60, stroke: 5, text: "text-lg", labelGap: "mt-1.5 text-xs", glow: false },
  lg: { box: 88, stroke: 6, text: "text-2xl", labelGap: "mt-2 text-sm", glow: true },
  hero: { box: 152, stroke: 9, text: "text-5xl", labelGap: "mt-3 text-base", glow: true },
} as const;

const GRADIENT_STOPS: Record<"safe" | "caution" | "risk", [string, string]> = {
  safe: ["#34d399", "#06b6d4"],
  caution: ["#fbbf24", "#f59e0b"],
  risk: ["#f87171", "#ef4444"],
};

const GLOW_SHADOW: Record<"safe" | "caution" | "risk", string> = {
  safe: "var(--shadow-glow-safe)",
  caution: "var(--shadow-glow-caution)",
  risk: "var(--shadow-glow-risk)",
};

/**
 * Circular Women Safety Index indicator.
 * Score is 0–100. Color follows the shared WSI thresholds:
 * 90–100 safe (green→cyan), 70–89 caution (amber), below 70 risk (red).
 */
export function WSIScore({ score, size = "md", showLabel = false, className }: WSIScoreProps) {
  const gradientId = useId();
  const level = getSafetyLevel(score);
  const { label, textClass } = getSafetyLevelConfig(score);
  const { box, stroke, text, labelGap, glow } = SIZE_CONFIG[size];
  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const [stopStart, stopEnd] = GRADIENT_STOPS[level];

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{ width: box, height: box, boxShadow: glow ? GLOW_SHADOW[level] : undefined }}
      >
        <svg width={box} height={box} className="-rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={stopStart} />
              <stop offset="100%" stopColor={stopEnd} />
            </linearGradient>
          </defs>
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            strokeWidth={stroke}
            className="fill-none stroke-white/[0.06]"
          />
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            stroke={`url(#${gradientId})`}
            className="fill-none transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center font-display font-semibold text-neutral-50",
            text
          )}
        >
          {score}
        </div>
      </div>
      {showLabel && <span className={cn("font-medium", textClass, labelGap)}>{label}</span>}
    </div>
  );
}

import { cn } from "@/lib/cn";
import { getSafetyLevelConfig } from "@/utils/safety";

export interface WSIScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  sm: { box: 44, stroke: 4, text: "text-sm", labelGap: "mt-1 text-[11px]" },
  md: { box: 60, stroke: 5, text: "text-lg", labelGap: "mt-1.5 text-xs" },
  lg: { box: 84, stroke: 6, text: "text-2xl", labelGap: "mt-2 text-sm" },
} as const;

/**
 * Circular Women Safety Index indicator.
 * Score is 0–100. Color follows the shared WSI thresholds:
 * 90–100 safe (green), 70–89 caution (yellow), below 70 risk (red).
 */
export function WSIScore({ score, size = "md", showLabel = false, className }: WSIScoreProps) {
  const { label, textClass, ringClass } = getSafetyLevelConfig(score);
  const { box, stroke, text, labelGap } = SIZE_CONFIG[size];
  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: box, height: box }}>
        <svg width={box} height={box} className="-rotate-90">
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            strokeWidth={stroke}
            className="fill-none stroke-white/10"
          />
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("fill-none transition-[stroke-dashoffset] duration-500", ringClass)}
          />
        </svg>
        <div className={cn("absolute inset-0 flex items-center justify-center font-semibold text-neutral-50", text)}>
          {score}
        </div>
      </div>
      {showLabel && <span className={cn("font-medium", textClass, labelGap)}>{label}</span>}
    </div>
  );
}

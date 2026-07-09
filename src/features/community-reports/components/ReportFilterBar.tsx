import { cn } from "@/lib/cn";
import { REPORT_CATEGORY_LABEL, type ReportCategory } from "@/features/community-reports/types";

const CATEGORIES = Object.keys(REPORT_CATEGORY_LABEL) as ReportCategory[];

export interface ReportFilterBarProps {
  active: ReportCategory | "all";
  onChange: (category: ReportCategory | "all") => void;
}

export function ReportFilterBar({ active, onChange }: ReportFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterPill label="All reports" isActive={active === "all"} onClick={() => onChange("all")} />
      {CATEGORIES.map((cat) => (
        <FilterPill
          key={cat}
          label={REPORT_CATEGORY_LABEL[cat]}
          isActive={active === cat}
          onClick={() => onChange(cat)}
        />
      ))}
    </div>
  );
}

function FilterPill({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[--radius-full] border px-3.5 py-1.5 text-xs font-medium transition-colors",
        isActive
          ? "border-primary-500/40 bg-primary-500/10 text-primary-300"
          : "border-[--color-border-default] text-neutral-400 hover:text-neutral-100"
      )}
    >
      {label}
    </button>
  );
}

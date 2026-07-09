import { MapPin, Clock, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/utils/formatting";
import { REPORT_CATEGORY_ICON, SEVERITY_CONFIG } from "@/features/community-reports/components/reportMeta";
import { REPORT_CATEGORY_LABEL } from "@/features/community-reports/types";
import type { CommunityReport } from "@/features/community-reports/types";

export function ReportCard({ report }: { report: CommunityReport }) {
  const Icon = REPORT_CATEGORY_ICON[report.category];
  const severity = SEVERITY_CONFIG[report.severity];

  return (
    <Card>
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[--radius-md] bg-[--color-bg-surface-raised] text-neutral-300">
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{REPORT_CATEGORY_LABEL[report.category]}</Badge>
            <Badge variant={severity.badgeVariant}>{severity.label}</Badge>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-neutral-50">{report.title}</h3>
          <p className="mt-1 text-sm text-neutral-400">{report.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} />
              {report.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} />
              {formatRelativeTime(report.reportedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={13} />
              Verified by {report.verifiedCount}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

import { useMemo, useState } from "react";
import { Plus, FileWarning } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReportCard } from "@/features/community-reports/components/ReportCard";
import { ReportFilterBar } from "@/features/community-reports/components/ReportFilterBar";
import { COMMUNITY_REPORTS } from "@/features/community-reports/mockData";
import type { ReportCategory } from "@/features/community-reports/types";
import { ReportIncidentForm } from "@/features/report-incident/components/ReportIncidentForm";

export default function ReportsPage() {
  const [activeCategory, setActiveCategory] = useState<ReportCategory | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredReports = useMemo(
    () =>
      activeCategory === "all"
        ? COMMUNITY_REPORTS
        : COMMUNITY_REPORTS.filter((r) => r.category === activeCategory),
    [activeCategory]
  );

  return (
    <PageWrapper className="py-0">
      <SectionHeader
        title="Community reports"
        description="Safety reports shared by people in your area."
        action={
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            New report
          </Button>
        }
      />

      <div className="mb-6">
        <ReportFilterBar active={activeCategory} onChange={setActiveCategory} />
      </div>

      {filteredReports.length === 0 ? (
        <EmptyState
          icon={<FileWarning size={32} />}
          title="No reports in this category"
          description="Try a different filter, or be the first to report something here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report an incident">
        <ReportIncidentForm onSubmitted={() => setIsModalOpen(false)} />
      </Modal>
    </PageWrapper>
  );
}

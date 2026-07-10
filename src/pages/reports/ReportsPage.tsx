import { useMemo, useState } from "react";
import { Plus, FileWarning, AlertTriangle } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ReportCard } from "@/features/community-reports/components/ReportCard";
import { ReportFilterBar } from "@/features/community-reports/components/ReportFilterBar";
import { useReports } from "@/features/community-reports/api/useReports";
import type { ReportCategory } from "@/features/community-reports/types";
import { ReportIncidentForm } from "@/features/report-incident/components/ReportIncidentForm";

export default function ReportsPage() {
  const [activeCategory, setActiveCategory] = useState<ReportCategory | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: reports, isLoading, isError, error, refetch } = useReports();

  const filteredReports = useMemo(() => {
    if (!reports) return [];
    return activeCategory === "all" ? reports : reports.filter((r) => r.category === activeCategory);
  }, [reports, activeCategory]);

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

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" label="Loading reports" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={<AlertTriangle size={32} />}
          title="Couldn't load reports"
          description={error instanceof Error ? error.message : "Something went wrong. Please try again."}
          action={
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : filteredReports.length === 0 ? (
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

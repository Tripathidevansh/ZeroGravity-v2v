import { Plus } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileWarning } from "lucide-react";

export default function ReportsPage() {
  return (
    <PageWrapper className="py-0">
      <SectionHeader
        title="Community reports"
        description="Safety reports shared by people in your area."
        action={
          <Button size="sm">
            <Plus size={16} />
            New report
          </Button>
        }
      />

      <EmptyState
        icon={<FileWarning size={32} />}
        title="No reports yet"
        description="Community safety reports will appear here once submitted."
        action={
          <Button variant="outline" size="sm">
            <Plus size={16} />
            File the first report
          </Button>
        }
      />
    </PageWrapper>
  );
}

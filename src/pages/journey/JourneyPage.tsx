import { Navigation } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function JourneyPage() {
  return (
    <PageWrapper className="py-0">
      <SectionHeader title="Journey mode" description="Start a guided, safety-scored journey." />

      <Card className="mb-6">
        <CardHeader>
          <div>
            <CardTitle>Start a journey</CardTitle>
            <CardDescription>Enter a destination to begin.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <SearchBar containerClassName="flex-1" placeholder="Enter destination" />
          <Button className="sm:w-auto">Start</Button>
        </CardContent>
      </Card>

      <EmptyState
        icon={<Navigation size={32} />}
        title="No active journey"
        description="Once you start a journey, live safety status will appear here."
      />
    </PageWrapper>
  );
}

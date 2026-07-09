import { ShieldCheck, FileWarning, Navigation, Zap, Activity, Search } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardPage() {
  return (
    <PageWrapper className="py-0">
      <SectionHeader title="Dashboard" description="Your safety overview at a glance." />

      <div className="mb-6">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Search destination</CardTitle>
              <CardDescription>Find the safest route to where you're headed.</CardDescription>
            </div>
            <Search className="text-neutral-500" size={18} />
          </CardHeader>
          <CardContent>
            <SearchBar />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Safety score</CardTitle>
              <CardDescription>Your current area</CardDescription>
            </div>
            <ShieldCheck className="text-primary-400" size={18} />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-semibold text-neutral-50">—</span>
              <Badge variant="neutral">Not calculated yet</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent reports</CardTitle>
              <CardDescription>Nearby community reports</CardDescription>
            </div>
            <FileWarning className="text-secondary-400" size={18} />
          </CardHeader>
          <CardContent>
            <EmptyState title="No reports yet" description="Community reports will appear here." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Shortcuts for common tasks</CardDescription>
            </div>
            <Zap className="text-amber-400" size={18} />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <span className="rounded-[--radius-md] border border-[--color-border-default] px-3 py-2 text-neutral-400">
              Plan a route
            </span>
            <span className="rounded-[--radius-md] border border-[--color-border-default] px-3 py-2 text-neutral-400">
              File a report
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Journey status</CardTitle>
              <CardDescription>Live tracking</CardDescription>
            </div>
            <Navigation className="text-secondary-400" size={18} />
          </CardHeader>
          <CardContent>
            <EmptyState title="No active journey" description="Start a journey to see live status here." />
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Your latest actions on SafeCircle AI</CardDescription>
            </div>
            <Activity className="text-neutral-500" size={18} />
          </CardHeader>
          <CardContent>
            <EmptyState title="No activity yet" description="Your activity history will show up here." />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

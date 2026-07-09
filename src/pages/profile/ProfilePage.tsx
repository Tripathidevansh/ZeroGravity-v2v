import { UserCircle } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  return (
    <PageWrapper className="py-0">
      <SectionHeader title="Profile" description="Manage your account details." />

      <Card className="max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/10 text-primary-400">
              <UserCircle size={26} />
            </span>
            <div>
              <CardTitle>Account details</CardTitle>
              <CardDescription>Placeholder profile form — no data wired yet.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input label="Full name" placeholder="Jane Doe" />
          <Input type="email" label="Email" placeholder="you@example.com" />
          <Button className="mt-2 w-full sm:w-auto">Save changes</Button>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

import { MapPinned, Users, ShieldAlert, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: MapPinned,
    title: "AI Safe Route Recommendation",
    description: "Routes ranked by safety, not just distance and time.",
  },
  {
    icon: ShieldAlert,
    title: "Women Safety Index",
    description: "A composite score built from community reports and context.",
  },
  {
    icon: Users,
    title: "Community Safety Reports",
    description: "Real experiences from real people, kept current by the community.",
  },
  {
    icon: Sparkles,
    title: "AI Route Explanation",
    description: "Understand exactly why a route was recommended.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="What SafeCircle AI does"
          title="Prevention, not reaction"
          description="Every feature is designed to help you avoid an unsafe situation before it happens."
          align="center"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <span className="flex h-10 w-10 items-center justify-center rounded-[--radius-md] bg-primary-500/10 text-primary-400">
                  <Icon size={20} />
                </span>
              </CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardContent className="mt-2">{description}</CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

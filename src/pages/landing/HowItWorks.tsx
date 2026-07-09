import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";

const STEPS = [
  {
    step: "01",
    title: "Enter your destination",
    description: "Tell SafeCircle AI where you're headed, just like any map app.",
  },
  {
    step: "02",
    title: "We score every route",
    description: "Each possible path is scored using the Women Safety Index.",
  },
  {
    step: "03",
    title: "Travel the safest way",
    description: "Follow the recommended route with live journey support.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Process"
          title="How it works"
          description="A typed, three-step flow from destination to a safer arrival."
          align="center"
        />
        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map(({ step, title, description }) => (
            <div key={step} className="text-center sm:text-left">
              <span className="text-sm font-semibold text-primary-400">{step}</span>
              <h3 className="mt-2 text-lg font-semibold text-neutral-50">{title}</h3>
              <p className="mt-2 text-sm text-neutral-400">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";

const STEPS = [
  {
    step: "01",
    title: "Enter your destination",
    description: "Tell Nirbhaya AI where you're headed, just like any map app.",
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
    <section id="how-it-works" className="py-20 bg-[var(--color-bg-surface-raised)]">
      <Container>
        <SectionHeader
          eyebrow="Process"
          title="How it works"
          description="A typed, three-step flow from destination to a safer arrival."
          align="center"
        />
        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map(({ step, title, description }) => (
            <div key={step} className="text-center sm:text-left bg-[var(--color-neutral-950)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-[var(--shadow-soft)]">
              <span className="text-sm font-bold text-primary-600">{step}</span>
              <h3 className="mt-2 text-lg font-bold text-neutral-50">{title}</h3>
              <p className="mt-2 text-sm text-neutral-200">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

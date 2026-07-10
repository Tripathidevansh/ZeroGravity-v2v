import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function About() {
  return (
    <section id="about" className="py-20">
      <Container className="max-w-3xl">
        <SectionHeader
          eyebrow="Why we built this"
          title="Navigation apps optimize for speed. We optimize for safety."
          align="center"
        />
        <p className="text-center text-neutral-200">
          Existing navigation tools tell you the fastest way to get somewhere, but say nothing
          about whether that path is safe for women travelling alone. Nirbhaya AI was built
          to close that gap with a community-driven, AI-assisted approach to safer travel.
        </p>
      </Container>
    </section>
  );
}

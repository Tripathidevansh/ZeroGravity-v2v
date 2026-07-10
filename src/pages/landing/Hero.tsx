import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/paths";
import { APP_TAGLINE } from "@/utils/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      />
      <Container className="relative flex flex-col items-center text-center">
        <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary-500/25 bg-primary-500/10 px-4 py-1.5 text-xs font-medium text-primary-300 shadow-[var(--shadow-glow-primary)]">
          <ShieldCheck size={14} />
          Built for IEEE SHE Aspire — SafeSphere Track
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-neutral-50 sm:text-5xl lg:text-6xl">
          The{" "}
          <span className="bg-[image:var(--gradient-primary-accent)] bg-clip-text text-transparent">
            safest route
          </span>{" "}
          matters as much as the fastest one.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-neutral-400">{APP_TAGLINE}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link to={ROUTES.SIGNUP}>
            <Button size="lg">
              Get started
              <ArrowRight size={18} />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="outline">
              See how it works
            </Button>
          </a>
        </div>
      </Container>
    </section>
  );
}

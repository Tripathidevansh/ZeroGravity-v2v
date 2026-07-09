import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/paths";
import { APP_TAGLINE } from "@/utils/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,92,252,0.16),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(62,123,250,0.14),transparent_40%)]"
      />
      <Container className="relative flex flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-[--radius-full] border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-xs font-medium text-primary-300">
          <ShieldCheck size={14} />
          Built for IEEE SHE Aspire — SafeSphere Track
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-neutral-50 sm:text-5xl lg:text-6xl">
          The safest route matters as much as the fastest one.
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

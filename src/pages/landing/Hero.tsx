import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/paths";
import { APP_TAGLINE } from "@/utils/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[720px] flex items-center">
      {/* Background Cover Image — locally generated, high resolution */}
      <div
        className="absolute inset-0 bg-cover bg-right"
        aria-label="Empowered Indian woman walking safely at dusk"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />
      {/* Gradient overlay: dark on left for card legibility, clear on right for the photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      <Container className="relative py-24 sm:py-32">
        {/* Card left-aligned: max-w-lg keeps it compact, leaving right side open */}
        <div className="max-w-lg bg-white/75 backdrop-blur-lg p-8 sm:p-12 rounded-2xl border border-white/40 shadow-[0_8px_40px_rgba(184,0,73,0.18)] flex flex-col items-start text-left">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/25 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold text-primary-700 shadow-[var(--shadow-glow-primary)]">
            <ShieldCheck size={14} className="text-primary-500" />
            Built for IEEE SHE Aspire — SafeSphere Track
          </span>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            The{" "}
            <span className="bg-[image:var(--gradient-primary-accent)] bg-clip-text text-transparent">
              safest route
            </span>{" "}
            matters as much as the fastest one.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-neutral-700 font-medium">{APP_TAGLINE}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={ROUTES.SIGNUP}>
              <Button size="lg" className="px-8 font-semibold">
                Get started
                <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="border-primary-500/40 hover:border-primary-500/70 bg-white/30 text-primary-900 hover:text-primary-900">
                See how it works
              </Button>
            </a>
          </div>
        </div>
      </Container>
      {/* Fade to page background at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-[var(--color-bg-base)] to-transparent" />
    </section>
  );
}


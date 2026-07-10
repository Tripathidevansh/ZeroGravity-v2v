import { Link } from "react-router-dom";
import { ArrowRight, Shield } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/paths";

export function Hero() {
  return (
    <section className="relative h-[650px] w-full overflow-hidden flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_DGIn-_uBhrMI0kqH0fihRnm42G3inEuhD2UhEa3Xx72ahlDDPTs_O9uL_DEXL2iYhujVYloKBwzOz7m26evm43oFwTiDd1zPosIre5Y4rPHxKK_Q0fOEt1eoR2o-EeewSrQWHv4WY-t7pcLL-VIx-ElMBIaP409jhdJnwpMn1Vd0VwQkTClh4cIR9SYQRG_SU2mXWFIhapsqxO-225tA2U3_BA1EpBd6nPKkWbq3j3Hx9Yz6MHUocxlb8YWBa14D9RMwY6QoBys')`,
        }}
      />
      
      {/* Overlay Content */}
      <Container className="relative z-10 w-full">
        <div className="max-w-xl bg-white/60 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-[var(--shadow-soft)]">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-xs font-semibold text-primary-700">
            <Shield size={13} />
            Built for Nirbhaya AI
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-primary-600 leading-tight mb-4">
            Fearless, Every Step of the Way.
          </h1>
          <p className="text-base text-neutral-200 mb-8 font-body">
            Nirbhaya AI finds you the safest route, not just the fastest one. Experience the city with a companion that prioritizes your peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to={ROUTES.SIGNUP} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto shadow-[var(--shadow-glow-primary)]">
                Get Started
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to={ROUTES.LOGIN} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/40">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </Container>
      
      {/* Bottom transition gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--color-bg-base)] to-transparent" />
    </section>
  );
}

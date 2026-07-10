import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/paths";

export function CallToAction() {
  return (
    <section className="py-20">
      <Container>
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[image:var(--gradient-surface)] px-6 py-14 text-center shadow-[var(--shadow-soft)]">
          <h2 className="max-w-xl text-2xl font-bold text-neutral-50 sm:text-3xl">
            Ready to travel the safer way?
          </h2>
          <p className="max-w-md text-neutral-200 font-body">
            Join Nirbhaya AI and help build a safer map for everyone.
          </p>
          <Link to={ROUTES.SIGNUP}>
            <Button size="lg">
              Create your account
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}

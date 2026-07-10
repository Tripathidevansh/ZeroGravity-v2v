import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { ROUTES } from "@/routes/paths";
import { APP_NAME } from "@/utils/constants";

export interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12"
      style={{ backgroundImage: "var(--gradient-hero)" }}
    >
      <div className="relative w-full max-w-sm">
        <Link to={ROUTES.HOME} className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-semibold text-neutral-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-primary-accent)] shadow-[var(--shadow-glow-primary)]">
            <ShieldCheck className="text-white" size={17} />
          </span>
          {APP_NAME}
        </Link>
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="font-display text-2xl font-semibold text-neutral-50">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-neutral-400">{description}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-sm text-neutral-500">{footer}</div>}
      </div>
    </div>
  );
}

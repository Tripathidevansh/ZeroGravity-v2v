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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link to={ROUTES.HOME} className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-semibold text-neutral-50">
          <ShieldCheck className="text-primary-400" size={22} />
          {APP_NAME}
        </Link>
        <div className="rounded-[--radius-xl] border border-[--color-border-subtle] bg-[--color-bg-surface] p-8 shadow-[var(--shadow-soft)]">
          <h1 className="text-xl font-semibold text-neutral-50">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-neutral-400">{description}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-sm text-neutral-500">{footer}</div>}
      </div>
    </div>
  );
}

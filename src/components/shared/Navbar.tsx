import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { APP_NAME } from "@/utils/constants";
import { Button } from "@/components/ui/Button";
import type { NavItem } from "@/utils/constants";
import { ROUTES } from "@/routes/paths";

export interface NavbarProps {
  navItems: NavItem[];
  isAuthenticated?: boolean;
}

export function Navbar({ navItems, isAuthenticated = false }: NavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[--color-border-subtle] bg-[--color-bg-base]/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 font-display text-lg font-semibold text-neutral-50">
          <ShieldCheck className="text-primary-400" size={22} />
          {APP_NAME}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-100",
                  isActive && "text-neutral-50"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Link to={ROUTES.PROFILE}>
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </Link>
          ) : (
            <>
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to={ROUTES.SIGNUP}>
                <Button variant="primary" size="sm">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="text-neutral-300 md:hidden"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileOpen && (
        <div className="border-t border-[--color-border-subtle] bg-[--color-bg-base] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className="rounded-[--radius-sm] px-3 py-2.5 text-sm font-medium text-neutral-300 hover:bg-[--color-bg-surface-raised]"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link to={ROUTES.PROFILE} onClick={() => setIsMobileOpen(false)}>
                <Button variant="outline" className="w-full">
                  Profile
                </Button>
              </Link>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} onClick={() => setIsMobileOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to={ROUTES.SIGNUP} onClick={() => setIsMobileOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

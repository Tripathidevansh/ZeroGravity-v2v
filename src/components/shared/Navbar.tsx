import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShieldCheck, Bell } from "lucide-react";
import { cn } from "@/lib/cn";
import { APP_NAME } from "@/utils/constants";
import { Button } from "@/components/ui/Button";
import type { NavItem } from "@/utils/constants";
import { ROUTES } from "@/routes/paths";
import { useNotifications } from "@/features/notifications/api/useNotifications";

export interface NavbarProps {
  navItems: NavItem[];
  isAuthenticated?: boolean;
}

export function Navbar({ navItems, isAuthenticated = false }: NavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: notifications } = useNotifications(isAuthenticated);
  const hasUnread = isAuthenticated && (notifications ?? []).some((n) => !n.read);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between rounded-2xl glass-panel px-4 sm:px-6">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 font-display text-lg font-semibold text-neutral-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-primary-accent)] shadow-[var(--shadow-glow-primary)]">
            <ShieldCheck className="text-white" size={17} />
          </span>
          {APP_NAME}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/[0.05] hover:text-neutral-100",
                  isActive && "bg-white/[0.06] text-neutral-50"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to={ROUTES.NOTIFICATIONS}
                className="relative rounded-lg p-2 text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-100"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {hasUnread && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                )}
              </Link>
              <Link to={ROUTES.PROFILE}>
                <Button variant="outline" size="sm">
                  Profile
                </Button>
              </Link>
            </>
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
        <div className="mx-auto mt-2 w-full max-w-7xl rounded-2xl glass-panel px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 hover:bg-white/[0.06]"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.NOTIFICATIONS} onClick={() => setIsMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <Bell size={16} />
                    Notifications
                  </Button>
                </Link>
                <Link to={ROUTES.PROFILE} onClick={() => setIsMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Profile
                  </Button>
                </Link>
              </>
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

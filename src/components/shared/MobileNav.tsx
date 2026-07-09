import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileWarning, Navigation, UserCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/routes/paths";

const MOBILE_NAV_ITEMS = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Reports", path: ROUTES.REPORTS, icon: FileWarning },
  { label: "Journey", path: ROUTES.JOURNEY, icon: Navigation },
  { label: "Profile", path: ROUTES.PROFILE, icon: UserCircle },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[--color-border-subtle] bg-[--color-bg-base]/95 backdrop-blur md:hidden">
      {MOBILE_NAV_ITEMS.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-neutral-500",
              isActive && "text-primary-400"
            )
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

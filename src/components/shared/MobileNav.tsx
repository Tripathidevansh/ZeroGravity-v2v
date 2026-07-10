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
    <nav className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 flex justify-around rounded-2xl glass-panel px-2 py-2 md:hidden">
      {MOBILE_NAV_ITEMS.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium text-neutral-500 transition-colors",
              isActive && "bg-white/[0.06] text-primary-400"
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

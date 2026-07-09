import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileWarning, Navigation, UserCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/routes/paths";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Reports", path: ROUTES.REPORTS, icon: FileWarning },
  { label: "Journey", path: ROUTES.JOURNEY, icon: Navigation },
  { label: "Profile", path: ROUTES.PROFILE, icon: UserCircle },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-[--color-border-subtle] bg-[--color-bg-surface] px-3 py-6 md:flex md:flex-col">
      <nav className="flex flex-col gap-1">
        {SIDEBAR_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-[--radius-md] px-3 py-2.5 text-sm font-medium text-neutral-400 transition-colors",
                "hover:bg-[--color-bg-surface-raised] hover:text-neutral-100",
                isActive && "bg-primary-500/10 text-primary-300"
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

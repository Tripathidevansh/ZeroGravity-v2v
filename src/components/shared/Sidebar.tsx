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
    <aside className="sticky top-[6.5rem] hidden h-[calc(100vh-8rem)] w-64 shrink-0 pl-3 md:flex md:flex-col">
      <nav className="glass-panel flex flex-col gap-1 rounded-2xl p-3">
        {SIDEBAR_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-neutral-400 transition-all duration-200",
                "hover:bg-white/[0.05] hover:text-neutral-100",
                isActive &&
                  "bg-[image:var(--gradient-primary)] text-white shadow-[var(--shadow-glow-primary)] hover:bg-[image:var(--gradient-primary)] hover:text-white"
              )
            }
          >
            <Icon size={18} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

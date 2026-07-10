import { ROUTES } from "@/routes/paths";

export const APP_NAME = "Nirbhaya AI";
export const APP_TAGLINE =
  "Google Maps tells you the fastest route. Nirbhaya AI tells you the safest one.";

export type NavItem = {
  label: string;
  path: string;
};

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: "Features", path: "/#features" },
  { label: "How It Works", path: "/#how-it-works" },
  { label: "About", path: "/#about" },
];

export const AUTH_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: ROUTES.DASHBOARD },
  { label: "Reports", path: ROUTES.REPORTS },
  { label: "Journey", path: ROUTES.JOURNEY },
  { label: "Profile", path: ROUTES.PROFILE },
];

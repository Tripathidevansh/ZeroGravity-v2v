import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PUBLIC_NAV_ITEMS } from "@/utils/constants";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar navItems={PUBLIC_NAV_ITEMS} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

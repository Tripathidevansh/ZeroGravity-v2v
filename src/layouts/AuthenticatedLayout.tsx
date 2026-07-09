import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/shared/Navbar";
import { Sidebar } from "@/components/shared/Sidebar";
import { MobileNav } from "@/components/shared/MobileNav";
import { Container } from "@/components/shared/Container";
import { AUTH_NAV_ITEMS } from "@/utils/constants";

export function AuthenticatedLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar navItems={AUTH_NAV_ITEMS} isAuthenticated />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pb-20 md:pb-0">
          <Container className="py-6">
            <Outlet />
          </Container>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Sidebar } from "@/components/shared/Sidebar";
import { MobileNav } from "@/components/shared/MobileNav";
import { Container } from "@/components/shared/Container";
import { AUTH_NAV_ITEMS } from "@/utils/constants";

export function AuthenticatedLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar navItems={AUTH_NAV_ITEMS} isAuthenticated />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pb-20 md:pb-0">
          <Container className="py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </Container>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

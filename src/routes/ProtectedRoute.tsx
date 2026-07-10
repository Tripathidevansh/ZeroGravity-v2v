import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/routes/paths";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/**
 * Wraps the authenticated route tree. While the initial session check is
 * in flight, renders nothing but a spinner (avoids a login-page flash for
 * users who are actually signed in). Once resolved, redirects to /login if
 * there's no session, preserving the intended destination for after login.
 */
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" label="Checking your session" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

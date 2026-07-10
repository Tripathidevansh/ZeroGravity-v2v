import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import LandingPage from "@/pages/landing/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ReportsPage from "@/pages/reports/ReportsPage";
import JourneyPage from "@/pages/journey/JourneyPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import RouteResultsPage from "@/pages/routes/RouteResultsPage";
import RouteDetailsPage from "@/pages/routes/RouteDetailsPage";
import NotificationsPage from "@/pages/notifications/NotificationsPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import { ROUTES } from "@/routes/paths";

/**
 * Route tree.
 * Public routes (landing, auth) use PublicLayout.
 * App routes (dashboard, reports, journey, profile, ...) use
 * AuthenticatedLayout and are gated behind ProtectedRoute, which checks the
 * real Supabase session and redirects to /login if there isn't one.
 */
export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.HOME, element: <LandingPage /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.SIGNUP, element: <SignupPage /> },
      { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AuthenticatedLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.REPORTS, element: <ReportsPage /> },
          { path: ROUTES.JOURNEY, element: <JourneyPage /> },
          { path: ROUTES.PROFILE, element: <ProfilePage /> },
          { path: ROUTES.ROUTE_RESULTS, element: <RouteResultsPage /> },
          { path: ROUTES.ROUTE_DETAILS, element: <RouteDetailsPage /> },
          { path: ROUTES.NOTIFICATIONS, element: <NotificationsPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

/**
 * Central route path constants.
 * Never hardcode route strings elsewhere — import from ROUTES.
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  REPORTS: "/reports",
  JOURNEY: "/journey",
  PROFILE: "/profile",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

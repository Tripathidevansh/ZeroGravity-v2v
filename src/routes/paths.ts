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
  ROUTE_RESULTS: "/routes",
  ROUTE_DETAILS: "/routes/:routeId",
  NOTIFICATIONS: "/notifications",
  EMERGENCY: "/emergency",
} as const;

export function routeDetailsPath(routeId: string) {
  return `/routes/${routeId}`;
}

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

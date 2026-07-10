import type { ReportSeverityRow } from "@/types/database";

export interface WSIPoint {
  lat: number;
  lng: number;
}

export interface WSIReportInput {
  lat: number;
  lng: number;
  severity: ReportSeverityRow;
  createdAt: string; // ISO
}

export interface WSIInfrastructureInput {
  lat: number;
  lng: number;
  type: "police" | "hospital" | "safe-place";
}

const SEVERITY_WEIGHT: Record<ReportSeverityRow, number> = {
  low: 3,
  medium: 7,
  high: 14,
};

const REPORT_RADIUS_KM = 1.5;
const INFRA_RADIUS_KM = 1.2;
const TIME_DECAY_HALF_LIFE_HOURS = 72; // a report's weight halves every 3 days
const MAX_PENALTY = 70; // reports alone can never drag the score below 30
const MAX_INFRA_BONUS = 12;

/** Haversine distance in kilometers between two lat/lng points. */
export function distanceKm(a: WSIPoint, b: WSIPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function timeDecayFactor(createdAt: string, now: number): number {
  const ageHours = Math.max(0, (now - new Date(createdAt).getTime()) / 3_600_000);
  return Math.pow(0.5, ageHours / TIME_DECAY_HALF_LIFE_HOURS);
}

/**
 * Computes a deterministic 0–100 Women Safety Index for a location.
 *
 * Factors (all pure, no randomness):
 * - Community reports within {@link REPORT_RADIUS_KM}, weighted by severity
 *   and decayed by how recently they were filed (recent reports count more).
 * - Nearby verified infrastructure (police, hospitals, 24/7 safe places)
 *   within {@link INFRA_RADIUS_KM}, which offsets the score slightly —
 *   proximity to help raises perceived safety.
 *
 * Given the same reports/infrastructure/location/time, this always returns
 * the same score — there is no random jitter anywhere in this function.
 */
export function computeWSI(
  location: WSIPoint,
  reports: WSIReportInput[],
  infrastructure: WSIInfrastructureInput[],
  now: number = Date.now()
): number {
  let penalty = 0;
  for (const report of reports) {
    const distance = distanceKm(location, report);
    if (distance > REPORT_RADIUS_KM) continue;

    const proximityFactor = 1 - distance / REPORT_RADIUS_KM; // closer reports matter more
    const decay = timeDecayFactor(report.createdAt, now);
    penalty += SEVERITY_WEIGHT[report.severity] * proximityFactor * decay;
  }
  penalty = Math.min(penalty, MAX_PENALTY);

  let bonus = 0;
  for (const point of infrastructure) {
    const distance = distanceKm(location, point);
    if (distance > INFRA_RADIUS_KM) continue;
    const proximityFactor = 1 - distance / INFRA_RADIUS_KM;
    const weight = point.type === "safe-place" ? 1.5 : 2.5; // police/hospital weigh slightly more
    bonus += weight * proximityFactor;
  }
  bonus = Math.min(bonus, MAX_INFRA_BONUS);

  const score = 100 - penalty + bonus;
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Convenience for scoring an entire route: averages the WSI across each
 * waypoint on the path, which naturally weighs longer/more-exposed routes
 * lower than short, well-covered ones.
 */
export function computeRouteWSI(
  path: WSIPoint[],
  reports: WSIReportInput[],
  infrastructure: WSIInfrastructureInput[],
  now: number = Date.now()
): number {
  if (path.length === 0) return 100;
  const scores = path.map((point) => computeWSI(point, reports, infrastructure, now));
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
}

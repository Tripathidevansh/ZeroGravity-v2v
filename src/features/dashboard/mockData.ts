export interface RecentJourney {
  id: string;
  destinationName: string;
  date: string; // ISO
  wsi: number;
  distanceKm: number;
}

export interface CommunityStat {
  label: string;
  value: string;
}

export const TODAY_SAFETY_SCORE = 87;

export const RECENT_JOURNEYS: RecentJourney[] = [
  { id: "j-1", destinationName: "Office — DLF Cyber City", date: new Date(Date.now() - 18 * 3_600_000).toISOString(), wsi: 88, distanceKm: 34.2 },
  { id: "j-2", destinationName: "College — JIIT Sector 62", date: new Date(Date.now() - 26 * 3_600_000).toISOString(), wsi: 94, distanceKm: 3.1 },
  { id: "j-3", destinationName: "Metro Station", date: new Date(Date.now() - 50 * 3_600_000).toISOString(), wsi: 79, distanceKm: 4.6 },
];

export const NEARBY_SAFE_PLACES = [
  { id: "sp-1", name: "Fortis Hospital", distanceKm: 0.8 },
  { id: "sp-2", name: "Sector 58 Police Post", distanceKm: 1.1 },
  { id: "sp-3", name: "DLF Mall of India", distanceKm: 1.6 },
];

export const COMMUNITY_STATS: CommunityStat[] = [
  { label: "Reports this week", value: "212" },
  { label: "Active community members", value: "4,380" },
  { label: "Safer routes chosen", value: "1,024" },
  { label: "Avg. response acknowledgement", value: "6 min" },
];

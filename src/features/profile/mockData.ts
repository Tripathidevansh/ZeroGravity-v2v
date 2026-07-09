import type { TrustedContact } from "@/features/profile/types";

export const CURRENT_USER = {
  name: "Ananya Sharma",
  email: "ananya.sharma@example.com",
  memberSince: "Jan 2026",
};

export const TRUSTED_CONTACTS: TrustedContact[] = [
  { id: "tc-1", name: "Rohan Sharma", relation: "Brother", phone: "+91 98765 43210" },
  { id: "tc-2", name: "Priya Nair", relation: "Roommate", phone: "+91 91234 56780" },
];

export const EMERGENCY_CONTACT: TrustedContact = {
  id: "tc-emergency",
  name: "Rohan Sharma",
  relation: "Primary emergency contact",
  phone: "+91 98765 43210",
};

export const JOURNEY_HISTORY = [
  { id: "jh-1", destinationName: "Office — DLF Cyber City", date: new Date(Date.now() - 18 * 3_600_000).toISOString(), wsi: 88, distanceKm: 34.2 },
  { id: "jh-2", destinationName: "College — JIIT Sector 62", date: new Date(Date.now() - 26 * 3_600_000).toISOString(), wsi: 94, distanceKm: 3.1 },
  { id: "jh-3", destinationName: "Metro Station", date: new Date(Date.now() - 50 * 3_600_000).toISOString(), wsi: 79, distanceKm: 4.6 },
  { id: "jh-4", destinationName: "Airport", date: new Date(Date.now() - 96 * 3_600_000).toISOString(), wsi: 82, distanceKm: 28.7 },
  { id: "jh-5", destinationName: "Sector 18 Market", date: new Date(Date.now() - 140 * 3_600_000).toISOString(), wsi: 68, distanceKm: 5.4 },
];

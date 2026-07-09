import type { SavedLocation } from "@/features/destination-search/types";

export const SAVED_LOCATIONS: SavedLocation[] = [
  {
    id: "loc-home",
    name: "Home",
    address: "Sector 62, Noida, UP",
    category: "home",
    lat: 28.6139,
    lng: 77.366,
  },
  {
    id: "loc-office",
    name: "Office",
    address: "DLF Cyber City, Gurugram",
    category: "office",
    lat: 28.4949,
    lng: 77.0891,
  },
  {
    id: "loc-college",
    name: "College",
    address: "Jaypee Institute of Information Technology, Sector 62",
    category: "college",
    lat: 28.6098,
    lng: 77.3649,
  },
  {
    id: "loc-metro",
    name: "Metro Station",
    address: "Botanical Garden Metro Station, Noida",
    category: "transit",
    lat: 28.5651,
    lng: 77.334,
  },
  {
    id: "loc-airport",
    name: "Airport",
    address: "Indira Gandhi International Airport, Delhi",
    category: "airport",
    lat: 28.5562,
    lng: 77.1,
  },
];

export const RECENT_LOCATIONS: SavedLocation[] = [
  {
    id: "loc-recent-1",
    name: "Sector 18 Market",
    address: "Sector 18, Noida",
    category: "custom",
    lat: 28.5697,
    lng: 77.3261,
  },
  {
    id: "loc-recent-2",
    name: "Amity University",
    address: "Sector 125, Noida",
    category: "custom",
    lat: 28.5433,
    lng: 77.3308,
  },
];

export const SUGGESTED_LOCATIONS: SavedLocation[] = [
  {
    id: "loc-suggested-1",
    name: "Fortis Hospital",
    address: "Sector 62, Noida",
    category: "custom",
    lat: 28.621,
    lng: 77.362,
  },
  {
    id: "loc-suggested-2",
    name: "DLF Mall of India",
    address: "Sector 18, Noida",
    category: "custom",
    lat: 28.5678,
    lng: 77.3262,
  },
  {
    id: "loc-suggested-3",
    name: "Sector 62 Metro Station",
    address: "Sector 62, Noida",
    category: "transit",
    lat: 28.6265,
    lng: 77.3711,
  },
];

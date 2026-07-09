export type LocationCategory = "home" | "office" | "college" | "transit" | "airport" | "custom";

export interface SavedLocation {
  id: string;
  name: string;
  address: string;
  category: LocationCategory;
  lat: number;
  lng: number;
}

import { Home, Briefcase, GraduationCap, TrainFront, Plane, MapPin } from "lucide-react";
import type { LocationCategory } from "@/features/destination-search/types";

export const LOCATION_CATEGORY_ICON: Record<LocationCategory, typeof Home> = {
  home: Home,
  office: Briefcase,
  college: GraduationCap,
  transit: TrainFront,
  airport: Plane,
  custom: MapPin,
};

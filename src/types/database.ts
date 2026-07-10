export type ReportCategoryRow =
  | "poor-lighting"
  | "harassment"
  | "unsafe-area"
  | "suspicious-activity"
  | "broken-streetlight";

export type ReportSeverityRow = "low" | "medium" | "high";
export type ReportStatusRow = "pending" | "approved" | "rejected";
export type JourneyStatusRow = "active" | "completed" | "cancelled";
export type NotificationTypeRow = "alert" | "success" | "safety" | "ai";
export type InfrastructureTypeRow = "police" | "hospital" | "safe-place";
export type LocationCategoryRow = "home" | "office" | "college" | "transit" | "airport" | "custom";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          avatar_url: string | null;
          member_since: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string; email: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      saved_places: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          address: string;
          category: LocationCategoryRow;
          lat: number;
          lng: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["saved_places"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["saved_places"]["Row"]>;
        Relationships: [];
      };
      community_reports: {
        Row: {
          id: string;
          user_id: string;
          category: ReportCategoryRow;
          title: string;
          description: string;
          location_text: string;
          lat: number;
          lng: number;
          severity: ReportSeverityRow;
          image_url: string | null;
          status: ReportStatusRow;
          verified_count: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["community_reports"]["Row"],
          "id" | "created_at" | "status" | "verified_count"
        > & {
          id?: string;
          created_at?: string;
          status?: ReportStatusRow;
          verified_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["community_reports"]["Row"]>;
        Relationships: [];
      };
      infrastructure_points: {
        Row: {
          id: string;
          name: string;
          type: InfrastructureTypeRow;
          address: string;
          lat: number;
          lng: number;
        };
        Insert: Database["public"]["Tables"]["infrastructure_points"]["Row"];
        Update: Partial<Database["public"]["Tables"]["infrastructure_points"]["Row"]>;
        Relationships: [];
      };
      journeys: {
        Row: {
          id: string;
          user_id: string;
          destination_name: string;
          destination_lat: number;
          destination_lng: number;
          origin_lat: number;
          origin_lng: number;
          distance_km: number;
          duration_min: number;
          wsi_score: number;
          status: JourneyStatusRow;
          started_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["journeys"]["Row"], "id" | "started_at" | "completed_at" | "status"> & {
          id?: string;
          started_at?: string;
          completed_at?: string | null;
          status?: JourneyStatusRow;
        };
        Update: Partial<Database["public"]["Tables"]["journeys"]["Row"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationTypeRow;
          title: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at" | "read"> & {
          id?: string;
          created_at?: string;
          read?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
        Relationships: [];
      };
      trusted_contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          relation: string;
          phone: string;
          is_emergency_contact: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["trusted_contacts"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trusted_contacts"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_community_stats: {
        Args: Record<PropertyKey, never>;
        Returns: {
          total_reports: number;
          active_members: number;
          safer_routes_chosen: number;
          reports_this_week: number;
        }[];
      };
    };
  };
}

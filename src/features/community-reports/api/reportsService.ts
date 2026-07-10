import { supabase } from "@/services/supabaseClient";
import type { CommunityReport, ReportCategory, ReportSeverity } from "@/features/community-reports/types";
import type { Database } from "@/types/database";

type ReportRow = Database["public"]["Tables"]["community_reports"]["Row"];

function mapRowToReport(row: ReportRow): CommunityReport {
  return {
    id: row.id,
    category: row.category as ReportCategory,
    title: row.title,
    description: row.description,
    location: row.location_text,
    severity: row.severity as ReportSeverity,
    reportedAt: row.created_at,
    verifiedCount: row.verified_count,
    lat: row.lat,
    lng: row.lng,
    imageUrl: row.image_url,
    status: row.status,
    userId: row.user_id,
  };
}

export async function fetchReports(): Promise<CommunityReport[]> {
  const { data, error } = await supabase
    .from("community_reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRowToReport);
}

export interface CreateReportInput {
  category: ReportCategory;
  description: string;
  location: string;
  lat: number;
  lng: number;
  severity: ReportSeverity;
  imageFile?: File | null;
}

/** A short, human-readable title derived from the category — the form only
 * collects a free-text description, matching the existing UI exactly. */
function deriveTitle(category: ReportCategory, location: string): string {
  const labels: Record<ReportCategory, string> = {
    "poor-lighting": "Poor lighting reported",
    harassment: "Harassment reported",
    "unsafe-area": "Unsafe area reported",
    "suspicious-activity": "Suspicious activity reported",
    "broken-streetlight": "Broken streetlights reported",
  };
  return `${labels[category]} near ${location}`;
}

export async function createReport(input: CreateReportInput): Promise<CommunityReport> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to submit a report.");

  let imageUrl: string | null = null;
  if (input.imageFile) {
    const path = `${user.id}/${Date.now()}-${input.imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("report-images")
      .upload(path, input.imageFile);
    if (uploadError) throw new Error(uploadError.message);
    imageUrl = supabase.storage.from("report-images").getPublicUrl(path).data.publicUrl;
  }

  const { data, error } = await supabase
    .from("community_reports")
    .insert({
      user_id: user.id,
      category: input.category,
      title: deriveTitle(input.category, input.location),
      description: input.description,
      location_text: input.location,
      lat: input.lat,
      lng: input.lng,
      severity: input.severity,
      image_url: imageUrl,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapRowToReport(data);
}

// Supabase Edge Function: get-emergency-tracking
// Deploy with: supabase functions deploy get-emergency-tracking --no-verify-jwt
//
// The --no-verify-jwt flag is required: this function must be callable by
// anonymous trusted contacts who clicked an emergency email link and have
// no Supabase session at all.
//
// SECURITY MODEL: this function uses the service role key (bypasses RLS)
// but only ever returns data for the exact emergency_events row matching
// the given tracking_token — it never exposes a way to list/enumerate
// events, and a wrong/guessed token returns a generic "not found" rather
// than leaking whether it was close. This is the ONLY place in the app
// that reads emergency/journey data without RLS, and it's intentionally
// narrow: one token in, one event's public-safe fields out.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Auto-provided to every Supabase Edge Function — no manual secret needed.
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { trackingToken } = await req.json();
    if (!trackingToken || typeof trackingToken !== "string") {
      return new Response(JSON.stringify({ error: "A tracking token is required." }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: emergency, error } = await supabase
      .from("emergency_events")
      .select("*")
      .eq("tracking_token", trackingToken)
      .maybeSingle();

    if (error || !emergency) {
      return new Response(JSON.stringify({ error: "This tracking link is invalid or has expired." }), {
        status: 404,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    let journey = null;
    if (emergency.journey_id) {
      const { data: journeyRow } = await supabase
        .from("journeys")
        .select("*")
        .eq("id", emergency.journey_id)
        .maybeSingle();
      journey = journeyRow;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", emergency.user_id)
      .maybeSingle();

    return new Response(
      JSON.stringify({
        emergency,
        journey,
        ownerName: profile?.full_name || "A SafeCircle AI user",
      }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});

// Supabase Edge Function: route-explanation
// Deploy with: supabase functions deploy route-explanation
// Requires the GEMINI_API_KEY secret: supabase secrets set GEMINI_API_KEY=your-key
//
// This function does ONLY one thing: given a route's safety metrics, it asks
// Gemini for a short, factual explanation of why the route scored the way it
// did. It is not a chatbot and holds no conversation history — one request,
// one explanation, done.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RouteExplanationRequest {
  routeLabel?: string;
  destinationName?: string;
  wsiScore?: number;
  distanceKm?: number;
  durationMin?: number;
  reportCount?: number;
  highlights?: string[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (!GEMINI_API_KEY) {
    console.error("Configuration Error: GEMINI_API_KEY is not set.");
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured on the server." }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    console.log("Edge Function route-explanation invoked.");
    let body: RouteExplanationRequest = {};
    try {
      body = await req.json();
      console.log("Parsed Request Body:", JSON.stringify(body));
    } catch (jsonErr) {
      console.error("Failed to parse request JSON body:", jsonErr);
      return new Response(JSON.stringify({ error: "Invalid JSON request body." }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // Provide robust default fallbacks for missing/null properties
    const routeLabel = body.routeLabel || "Alternative Route";
    const destinationName = body.destinationName || "Destination";
    const wsiScore = typeof body.wsiScore === "number" ? body.wsiScore : 100;
    const distanceKm = typeof body.distanceKm === "number" ? body.distanceKm : 0;
    const durationMin = typeof body.durationMin === "number" ? body.durationMin : 0;
    const reportCount = typeof body.reportCount === "number" ? body.reportCount : 0;
    const highlights = Array.isArray(body.highlights) ? body.highlights : [];

    const prompt = `You are a safety-routing assistant. Given the data below, write a short (2-3 sentence),
factual, reassuring-but-honest explanation of this route's Women Safety Index score for a
traveler deciding whether to use it. Do not invent facts not implied by the data. Do not
mention that you are an AI. Do not ask questions or offer further conversation — output only
the explanation text, nothing else.

Route: ${routeLabel} to ${destinationName}
Women Safety Index: ${wsiScore}/100
Distance: ${distanceKm} km, Estimated time: ${durationMin} min
Community reports along this route: ${reportCount}
Known route characteristics: ${highlights.join("; ") || "none noted"}`;

    console.log("Sending request to Gemini API...");

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 200 },
      }),
    });

    console.log(`Gemini API Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error Payload:", errText);
      throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    console.log("Successfully parsed Gemini response.");

    const explanation: string =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
      "No explanation could be generated for this route.";

    console.log("Generated Explanation:", explanation);

    return new Response(JSON.stringify({ explanation }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Runtime exception inside Edge Function:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});

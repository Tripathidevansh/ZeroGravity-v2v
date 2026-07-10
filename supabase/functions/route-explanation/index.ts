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
  routeLabel: string;
  destinationName: string;
  wsiScore: number;
  distanceKm: number;
  durationMin: number;
  reportCount: number;
  highlights: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured on the server." }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const body: RouteExplanationRequest = await req.json();

    const prompt = `You are a safety-routing assistant. Given the data below, write a short (2-3 sentence),
factual, reassuring-but-honest explanation of this route's Women Safety Index score for a
traveler deciding whether to use it. Do not invent facts not implied by the data. Do not
mention that you are an AI. Do not ask questions or offer further conversation — output only
the explanation text, nothing else.

Route: ${body.routeLabel} to ${body.destinationName}
Women Safety Index: ${body.wsiScore}/100
Distance: ${body.distanceKm} km, Estimated time: ${body.durationMin} min
Community reports along this route: ${body.reportCount}
Known route characteristics: ${body.highlights.join("; ") || "none noted"}`;

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 200 },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${errText}`);
    }

    const data = await response.json();
    const explanation: string =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
      "No explanation could be generated for this route.";

    return new Response(JSON.stringify({ explanation }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});

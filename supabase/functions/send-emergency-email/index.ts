// Supabase Edge Function: send-emergency-email
// Deploy with: supabase functions deploy send-emergency-email
// Requires the RESEND_API_KEY secret: supabase secrets set RESEND_API_KEY=your-key
//
// Sends one real email per trusted contact via Resend. Runs server-side so
// the Resend API key never reaches the browser bundle — same pattern as the
// route-explanation function for Gemini.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Resend's shared sandbox sender — works immediately with just an API key,
// no domain verification needed. Swap for your own verified domain
// (e.g. "SafeCircle AI <alerts@yourdomain.com>") once you have one.
const FROM_ADDRESS = "SafeCircle AI <onboarding@resend.dev>";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmergencyEmailContext {
  userName: string;
  triggeredAt: string; // ISO
  address: string | null;
  lat: number;
  lng: number;
  routeLabel: string | null;
  destinationName: string | null;
  journeyStatus: string | null;
  wsiScore: number | null;
  batteryLevel: number | null;
  trackingLink: string;
}

interface Contact {
  id: string;
  name: string;
  email: string | null;
}

interface RequestBody {
  contacts: Contact[];
  emergency: EmergencyEmailContext;
}

function buildEmailHtml(contact: Contact, ctx: EmergencyEmailContext): string {
  const googleMapsLink = `https://www.google.com/maps?q=${ctx.lat},${ctx.lng}`;
  const startedAt = new Date(ctx.triggeredAt).toLocaleString();

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;width:180px;">${label}</td><td style="padding:6px 0;color:#f8fafc;font-size:13px;font-weight:600;">${value}</td></tr>`;

  return `
    <div style="font-family:Arial,sans-serif;background:#050816;padding:32px;">
      <div style="max-width:520px;margin:0 auto;background:#111827;border-radius:16px;padding:28px;border:1px solid #262f45;">
        <p style="font-size:22px;font-weight:700;color:#ef4444;margin:0 0 4px;">🚨 Emergency Activated</p>
        <p style="color:#cbd5e1;font-size:14px;margin:0 0 20px;">
          ${contact.name}, ${ctx.userName} has activated Emergency SOS on SafeCircle AI and needs your attention.
        </p>
        <table style="width:100%;border-collapse:collapse;">
          ${row("User", ctx.userName)}
          ${row("Emergency started", startedAt)}
          ${row("Current address", ctx.address ?? "Unavailable")}
          ${row("Coordinates", `${ctx.lat.toFixed(5)}, ${ctx.lng.toFixed(5)}`)}
          ${row("Current route", ctx.routeLabel ?? "Not on an active journey")}
          ${row("Destination", ctx.destinationName ?? "N/A")}
          ${row("Journey status", ctx.journeyStatus ?? "N/A")}
          ${row("Women Safety Index", ctx.wsiScore !== null ? String(ctx.wsiScore) : "N/A")}
          ${row("Battery level", ctx.batteryLevel !== null ? `${ctx.batteryLevel}%` : "Unavailable")}
        </table>
        <div style="margin-top:24px;display:flex;gap:12px;">
          <a href="${googleMapsLink}" style="display:inline-block;background:#3b82f6;color:white;text-decoration:none;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:600;margin-right:10px;">
            View on Google Maps
          </a>
          <a href="${ctx.trackingLink}" style="display:inline-block;background:#7c3aed;color:white;text-decoration:none;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:600;">
            Open Live Tracking
          </a>
        </div>
        <p style="color:#64748b;font-size:11px;margin-top:24px;">
          This is an automated emergency alert from SafeCircle AI. If this seems unexpected, please try contacting ${ctx.userName} directly.
        </p>
      </div>
    </div>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY is not configured on the server." }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const body: RequestBody = await req.json();

    const results = await Promise.all(
      body.contacts.map(async (contact) => {
        if (!contact.email) {
          return { contactId: contact.id, name: contact.name, status: "failed" as const, sentAt: new Date().toISOString() };
        }

        try {
          const response = await fetch(RESEND_ENDPOINT, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: FROM_ADDRESS,
              to: contact.email,
              subject: `🚨 Emergency Alert — ${body.emergency.userName} needs help`,
              html: buildEmailHtml(contact, body.emergency),
            }),
          });

          if (!response.ok) {
            const errText = await response.text();
            console.error(`Resend error for ${contact.email}:`, errText);
            return { contactId: contact.id, name: contact.name, status: "failed" as const, sentAt: new Date().toISOString() };
          }

          return { contactId: contact.id, name: contact.name, status: "sent" as const, sentAt: new Date().toISOString() };
        } catch (err) {
          console.error(`Failed to send to ${contact.email}:`, err);
          return { contactId: contact.id, name: contact.name, status: "failed" as const, sentAt: new Date().toISOString() };
        }
      })
    );

    return new Response(JSON.stringify({ results }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});

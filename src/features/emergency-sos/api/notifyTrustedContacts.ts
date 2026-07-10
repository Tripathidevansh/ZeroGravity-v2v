import { supabase } from "@/services/supabaseClient";
import type { TrustedContactRow } from "@/features/profile/api/profileService";
import type { NotifiedContactResult } from "@/features/emergency-sos/types";

export interface EmergencyEmailContext {
  userName: string;
  triggeredAt: string;
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

/**
 * Sends a real emergency email to each trusted contact via the
 * `send-emergency-email` edge function (Resend). Contacts without an email
 * on file are reported as "failed" rather than silently skipped, so the
 * Emergency Dashboard's delivery status is honest about who wasn't reached.
 */
export async function notifyTrustedContacts(
  contacts: TrustedContactRow[],
  context: EmergencyEmailContext
): Promise<NotifiedContactResult[]> {
  const { data, error } = await supabase.functions.invoke<{ results: NotifiedContactResult[] }>(
    "send-emergency-email",
    {
      body: {
        contacts: contacts.map((c) => ({ id: c.id, name: c.name, email: c.email })),
        emergency: context,
      },
    }
  );

  if (error) {
    console.error("[SafeCircle AI] send-emergency-email failed:", error.message);
    // The emergency itself is still active even if notification delivery
    // failed entirely — report every contact as failed rather than throwing,
    // so activation isn't blocked by an email outage.
    return contacts.map((c) => ({
      contactId: c.id,
      name: c.name,
      status: "failed",
      sentAt: new Date().toISOString(),
    }));
  }

  return data?.results ?? [];
}

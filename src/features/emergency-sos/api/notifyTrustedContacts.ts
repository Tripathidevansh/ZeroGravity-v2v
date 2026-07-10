import type { TrustedContactRow } from "@/features/profile/api/profileService";
import type { NotifiedContactResult } from "@/features/emergency-sos/types";

/**
 * Sends an emergency alert to each trusted contact.
 *
 * INTEGRATION POINT: there is no SMS/WhatsApp/voice-call provider wired up
 * yet (would typically be Twilio, MSG91, or similar, called from a Supabase
 * Edge Function so provider credentials stay server-side — same pattern as
 * the Gemini route-explanation function). Until that exists, this simulates
 * a realistic per-contact send: a short delay, then a "sent" result.
 *
 * The function signature and return shape are already what a real
 * implementation would need — swapping the body for a real API call
 * requires no changes anywhere this is called from.
 */
export async function notifyTrustedContacts(
  contacts: TrustedContactRow[],
  location: { lat: number; lng: number }
): Promise<NotifiedContactResult[]> {
  const results = await Promise.all(
    contacts.map(async (contact, index) => {
      // Stagger slightly so a UI showing per-contact progress feels real
      // rather than everything resolving in the same tick.
      await new Promise((resolve) => setTimeout(resolve, 250 + index * 200));

      void location; // would be included in the real alert message/link

      return {
        contactId: contact.id,
        name: contact.name,
        status: "sent" as const,
        sentAt: new Date().toISOString(),
      };
    })
  );

  return results;
}

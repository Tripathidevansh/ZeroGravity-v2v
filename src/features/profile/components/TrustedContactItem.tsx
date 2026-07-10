import { Phone, Mail, User } from "lucide-react";
import type { TrustedContact } from "@/features/profile/types";

export function TrustedContactItem({ contact }: { contact: TrustedContact }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-[var(--color-border-default)] px-3 py-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500/10 text-primary-400">
        <User size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-100">{contact.name}</p>
        <p className="truncate text-xs text-neutral-500">{contact.relation}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5 text-xs text-neutral-500">
        <span className="inline-flex items-center gap-1.5">
          <Phone size={12} />
          {contact.phone}
        </span>
        {contact.email ? (
          <span className="inline-flex items-center gap-1.5">
            <Mail size={12} />
            {contact.email}
          </span>
        ) : (
          <span className="text-caution-400">No email on file</span>
        )}
      </div>
    </div>
  );
}

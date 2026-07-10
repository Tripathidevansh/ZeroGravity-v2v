import { Phone, Mail, User } from "lucide-react";
import type { TrustedContact } from "@/features/profile/types";

export function TrustedContactItem({ contact }: { contact: TrustedContact }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-md border border-[var(--color-border-default)] p-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-3 sm:py-2.5">
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500/10 text-primary-400">
          <User size={16} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-100">{contact.name}</p>
          <p className="truncate text-xs text-neutral-500">{contact.relation}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 pl-12 text-xs text-neutral-500 sm:flex-col sm:items-end sm:gap-0.5 sm:pl-0">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <Phone size={12} />
          {contact.phone}
        </span>
        {contact.email ? (
          <span className="inline-flex items-center gap-1.5 min-w-0">
            <Mail size={12} className="shrink-0" />
            <span className="truncate max-w-[12rem] sm:max-w-none">{contact.email}</span>
          </span>
        ) : (
          <span className="text-caution-400 whitespace-nowrap">No email on file</span>
        )}
      </div>
    </div>
  );
}

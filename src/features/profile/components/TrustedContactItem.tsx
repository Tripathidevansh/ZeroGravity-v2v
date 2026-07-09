import { Phone, User } from "lucide-react";
import type { TrustedContact } from "@/features/profile/types";

export function TrustedContactItem({ contact }: { contact: TrustedContact }) {
  return (
    <div className="flex items-center gap-3 rounded-[--radius-md] border border-[--color-border-default] px-3 py-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500/10 text-primary-400">
        <User size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-100">{contact.name}</p>
        <p className="truncate text-xs text-neutral-500">{contact.relation}</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-neutral-500">
        <Phone size={12} />
        {contact.phone}
      </span>
    </div>
  );
}

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { useCreateTrustedContact } from "@/features/profile/api/useProfile";

export interface AddTrustedContactFormProps {
  onSubmitted?: () => void;
}

export function AddTrustedContactForm({ onSubmitted }: AddTrustedContactFormProps) {
  const { showToast } = useToast();
  const createContact = useCreateTrustedContact();

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !relation.trim() || !phone.trim()) return;

    try {
      await createContact.mutateAsync({ name, relation, phone, email: email.trim() || undefined });
      showToast({
        variant: "success",
        title: "Trusted contact added",
        description: email.trim()
          ? `${name} will be emailed during an emergency alert.`
          : `${name} was added, but won't receive emergency emails without an address on file.`,
      });
      setName("");
      setRelation("");
      setPhone("");
      setEmail("");
      onSubmitted?.();
    } catch (err) {
      showToast({
        variant: "error",
        title: "Couldn't add contact",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Full name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input
        label="Relation"
        placeholder="e.g. Sister, Roommate, Friend"
        value={relation}
        onChange={(e) => setRelation(e.target.value)}
        required
      />
      <Input
        type="tel"
        label="Phone number"
        placeholder="+91 98765 43210"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <Input
        type="email"
        label="Email"
        placeholder="jane@example.com"
        hint="Required to receive emergency alert emails."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" isLoading={createContact.isPending} className="mt-2 w-full">
        Add contact
      </Button>
    </form>
  );
}

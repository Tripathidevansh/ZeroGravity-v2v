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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !relation.trim() || !phone.trim()) return;

    try {
      await createContact.mutateAsync({ name, relation, phone });
      showToast({
        variant: "success",
        title: "Trusted contact added",
        description: `${name} will be notified during an emergency alert.`,
      });
      setName("");
      setRelation("");
      setPhone("");
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
      <Button type="submit" isLoading={createContact.isPending} className="mt-2 w-full">
        Add contact
      </Button>
    </form>
  );
}

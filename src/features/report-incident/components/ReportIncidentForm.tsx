import { useRef, useState, type FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { REPORT_CATEGORY_LABEL, type ReportCategory, type ReportSeverity } from "@/features/community-reports/types";

const SEVERITY_OPTIONS: { value: ReportSeverity; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export interface ReportIncidentFormProps {
  onSubmitted?: () => void;
}

export function ReportIncidentForm({ onSubmitted }: ReportIncidentFormProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<ReportCategory>("poor-lighting");
  const [severity, setSeverity] = useState<ReportSeverity>("medium");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageName, setImageName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) return;

    setIsSubmitting(true);
    // No backend in Phase 2 — simulate a submission delay for realistic feel.
    setTimeout(() => {
      setIsSubmitting(false);
      showToast({
        variant: "success",
        title: "Report submitted",
        description: "Thank you for helping keep the community informed and safe.",
      });
      setDescription("");
      setLocation("");
      setImageName(null);
      onSubmitted?.();
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value as ReportCategory)}>
        {Object.entries(REPORT_CATEGORY_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <Textarea
        label="Description"
        placeholder="Describe what you saw — be as specific as possible."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <Input
        label="Location"
        placeholder="e.g. Sector 62 flyover, Noida"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-200">Severity</span>
        <div className="flex gap-2">
          {SEVERITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSeverity(opt.value)}
              className={cn(
                "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                severity === opt.value
                  ? "border-primary-500/40 bg-primary-500/10 text-primary-300"
                  : "border-[var(--color-border-default)] text-neutral-400 hover:text-neutral-100"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-200">Photo (optional)</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImageName(e.target.files?.[0]?.name ?? null)}
        />
        {imageName ? (
          <div className="flex items-center justify-between rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-surface-raised)] px-3.5 py-2.5 text-sm text-neutral-300">
            <span className="truncate">{imageName}</span>
            <button type="button" onClick={() => setImageName(null)} className="text-neutral-500 hover:text-neutral-100">
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-md border border-dashed border-[var(--color-border-default)] px-3.5 py-3 text-sm text-neutral-500 transition-colors hover:border-primary-400 hover:text-primary-300"
          >
            <ImagePlus size={16} />
            Add a photo
          </button>
        )}
      </div>

      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Submit report
      </Button>
    </form>
  );
}

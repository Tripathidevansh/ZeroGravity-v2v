import { useState } from "react";
import { Siren } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/contexts/ToastContext";

export function EmergencyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  const handleConfirm = () => {
    setIsOpen(false);
    showToast({
      variant: "error",
      title: "Emergency alert sent",
      description: "Your trusted contacts and live location have been shared. (Simulated — no real alert sent.)",
    });
  };

  return (
    <>
      <Button variant="danger" size="lg" className="w-full" onClick={() => setIsOpen(true)}>
        <Siren size={18} />
        Emergency SOS
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Send emergency alert?">
        <p className="text-sm text-neutral-400">
          This will notify your trusted contacts with your live location. This is a demo — no real
          alert will be sent.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleConfirm}>
            Send alert
          </Button>
        </div>
      </Modal>
    </>
  );
}

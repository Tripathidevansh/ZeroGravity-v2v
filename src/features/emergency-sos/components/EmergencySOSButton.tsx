import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Siren } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/contexts/ToastContext";
import { useActivateEmergency } from "@/features/emergency-sos/api/useEmergency";
import { fetchNearbyPlaces } from "@/services/infrastructureService";
import { findNearestByType } from "@/features/emergency-sos/utils";
import { getCurrentPosition } from "@/utils/geolocation";
import { ROUTES } from "@/routes/paths";

export interface EmergencySOSButtonProps {
  /** "floating" renders a fixed, always-visible FAB (Dashboard). "inline"
   * renders a normal full-width button in place (Journey Mode). */
  variant?: "floating" | "inline";
  /** Links the emergency event to the active journey, if any. */
  journeyId?: string | null;
  className?: string;
}

export function EmergencySOSButton({ variant = "inline", journeyId = null, className }: EmergencySOSButtonProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const activateEmergency = useActivateEmergency();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleActivate = async () => {
    setIsConfirmOpen(false);

    try {
      const location = await getCurrentPosition();
      // Fetched fresh at activation time, around the exact captured location
      // — not a stale pre-render value from wherever the button happened to
      // be mounted.
      const nearby = await fetchNearbyPlaces(location);
      const nearestPolice = findNearestByType(location, nearby, "police");
      const nearestHospital = findNearestByType(location, nearby, "hospital");

      await activateEmergency.mutateAsync({
        lat: location.lat,
        lng: location.lng,
        journeyId,
        nearestPoliceName: nearestPolice?.name,
        nearestHospitalName: nearestHospital?.name,
      });

      navigate(ROUTES.EMERGENCY);
    } catch (err) {
      showToast({
        variant: "error",
        title: "Couldn't activate Emergency SOS",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  return (
    <>
      {variant === "floating" ? (
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          aria-label="Activate Emergency SOS"
          className={cn(
            "fixed bottom-24 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full",
            "bg-risk-500 text-white shadow-[var(--shadow-glow-risk)] transition-transform duration-200",
            "hover:scale-105 hover:brightness-110 active:scale-95",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400",
            "md:bottom-6",
            className
          )}
        >
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-risk-500/50" aria-hidden="true" />
          <Siren size={26} />
        </button>
      ) : (
        <Button
          variant="danger"
          size="lg"
          className={cn("w-full", className)}
          onClick={() => setIsConfirmOpen(true)}
        >
          <Siren size={18} />
          Emergency SOS
        </Button>
      )}

      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Activate Emergency SOS?">
        <p className="text-sm text-neutral-400">
          Are you sure you want to activate Emergency SOS? Your current location will be captured,
          your trusted contacts will be alerted, and you'll be taken to the Emergency Dashboard.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setIsConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            isLoading={activateEmergency.isPending}
            onClick={handleActivate}
          >
            Activate SOS
          </Button>
        </div>
      </Modal>
    </>
  );
}

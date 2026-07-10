import { useEffect } from "react";
import { useVoiceSOS } from "@/hooks/useVoiceSOS";
import { AlertOctagon, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SOSCountdown() {
  const { isCountdownActive, countdown, recognizedText, cancelCountdown } = useVoiceSOS();

  // Escape key cancels the countdown
  useEffect(() => {
    if (!isCountdownActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelCountdown();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCountdownActive, cancelCountdown]);

  if (!isCountdownActive) return null;

  // Calculate SVG circular progress details
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (countdown / 10) * circumference;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/90 p-4 backdrop-blur-xl animate-fade-in"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="sos-title"
      aria-describedby="sos-desc"
    >
      {/* Screen Reader Announcements */}
      <div aria-live="assertive" className="sr-only">
        Emergency voice trigger detected. Activating SOS in {countdown} seconds. Say stop or click cancel to abort.
      </div>

      <div className="relative flex w-full max-w-md flex-col items-center rounded-2xl border border-red-500/20 bg-neutral-900/80 p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.2)] backdrop-blur-md">
        <span className="absolute inset-0 -z-10 animate-pulse rounded-2xl bg-red-500/5 opacity-5" />

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 animate-bounce">
          <AlertOctagon size={32} />
        </div>

        <h2 id="sos-title" className="text-2xl font-bold tracking-tight text-neutral-50">
          🚨 Emergency Detected
        </h2>
        
        <p id="sos-desc" className="mt-2 text-sm text-neutral-400">
          A voice trigger was recognized. Sending emergency SOS alerts in:
        </p>

        {/* Circular Countdown Progress */}
        <div className="relative my-8 flex items-center justify-center">
          <svg className="h-36 w-36 -rotate-90 transform">
            {/* Background Track */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-red-950 fill-none"
              strokeWidth="8"
            />
            {/* Progress Stroke */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-red-500 fill-none transition-all duration-1000 ease-linear"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-4xl font-extrabold text-red-400 tabular-nums">
            {countdown}
          </span>
        </div>

        {/* Matched Voice Transcript */}
        <div className="mb-8 w-full rounded-lg border border-white/5 bg-white/[0.02] p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Detected Phrase:
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm italic text-neutral-300">
            <Volume2 size={14} className="text-red-400 shrink-0" />
            "{recognizedText || "Help"}"
          </p>
        </div>

        {/* Cancel Button and Voice Control Hint */}
        <div className="flex w-full flex-col gap-3">
          <Button
            variant="danger"
            size="lg"
            className="w-full font-semibold focus-visible:ring-offset-neutral-900 focus-visible:ring-red-400"
            onClick={cancelCountdown}
            aria-label="Cancel Emergency SOS Activation"
          >
            <X size={18} />
            Cancel (Aborted)
          </Button>
          <p className="text-xs text-neutral-500">
            Or say <span className="font-semibold text-neutral-400">"cancel"</span>, <span className="font-semibold text-neutral-400">"stop"</span>, or <span className="font-semibold text-neutral-400">"false alarm"</span> to abort.
          </p>
        </div>
      </div>
    </div>
  );
}

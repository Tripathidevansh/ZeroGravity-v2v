import { useVoiceSOS } from "@/hooks/useVoiceSOS";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/cn";

export function VoiceSOSIndicator() {
  const { isVoiceSOSActive, isListening, permissionStatus } = useVoiceSOS();

  if (permissionStatus === "unsupported") return null;

  // Subtle floating indicator in bottom-left corner so it doesn't overlap the SOS FAB (bottom-right)
  return (
    <div
      className={cn(
        "fixed bottom-24 left-5 z-40 flex items-center gap-2 rounded-full px-3 py-1.5",
        "border border-white/10 bg-neutral-900/75 backdrop-blur-md shadow-lg transition-all duration-300",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        "md:bottom-6 md:left-6"
      )}
    >
      <div className="relative flex h-2 w-2 shrink-0">
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            isVoiceSOSActive && isListening
              ? "bg-emerald-400"
              : isVoiceSOSActive
              ? "bg-amber-400"
              : "bg-neutral-500"
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            isVoiceSOSActive && isListening
              ? "bg-emerald-500"
              : isVoiceSOSActive
              ? "bg-amber-500"
              : "bg-neutral-500"
          )}
        />
      </div>

      <span className="text-[11px] font-medium text-neutral-300">
        {isVoiceSOSActive ? (
          isListening ? (
            <span className="flex items-center gap-1">
              <Mic size={10} className="text-emerald-400" />
              Voice SOS Active
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <MicOff size={10} className="text-amber-400" />
              Voice SOS Paused
            </span>
          )
        ) : (
          <span className="flex items-center gap-1">
            <MicOff size={10} className="text-neutral-500" />
            Voice SOS Off
          </span>
        )}
      </span>
    </div>
  );
}

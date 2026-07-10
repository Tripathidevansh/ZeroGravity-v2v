import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useActivateEmergency, useActiveEmergency } from "@/features/emergency-sos/api/useEmergency";
import { getCurrentPosition } from "@/utils/geolocation";
import { fetchNearbyPlaces } from "@/services/infrastructureService";
import { findNearestByType } from "@/features/emergency-sos/utils";
import { fetchActiveJourney } from "@/features/journey-mode/api/journeysService";
import { useToast } from "@/contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/paths";
import { captureSOSPhoto } from "@/services/sosCameraService";

export type PermissionState = "prompt" | "granted" | "denied" | "unsupported";

interface VoiceSOSContextType {
  isVoiceSOSActive: boolean;
  isListening: boolean;
  permissionStatus: PermissionState;
  isCountdownActive: boolean;
  countdown: number;
  recognizedText: string;
  enableVoiceSOS: () => Promise<boolean>;
  disableVoiceSOS: () => void;
  cancelCountdown: () => void;
}

const VoiceSOSContext = createContext<VoiceSOSContextType | null>(null);

const EMERGENCY_KEYWORDS = ["help me", "help", "emergency", "sos", "save me"];
const CANCEL_KEYWORDS = ["cancel", "stop", "false alarm"];

export function VoiceSOSProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const activateEmergency = useActivateEmergency();
  const { data: activeEmergency } = useActiveEmergency();

  const [isVoiceSOSActive, setIsVoiceSOSActive] = useState<boolean>(() => {
    return localStorage.getItem("voice_sos_active") !== "false";
  });
  const [isListening, setIsListening] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState>(() => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      return "unsupported";
    }
    return "prompt";
  });

  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [recognizedText, setRecognizedText] = useState("");

  const recognitionRef = useRef<any>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  
  // Track state in refs to avoid closure stale state in SpeechRecognition event handlers
  const stateRef = useRef({
    isVoiceSOSActive,
    isCountdownActive,
    hasActiveEmergency: !!activeEmergency,
  });

  useEffect(() => {
    stateRef.current = {
      isVoiceSOSActive,
      isCountdownActive,
      hasActiveEmergency: !!activeEmergency,
    };
  }, [isVoiceSOSActive, isCountdownActive, activeEmergency]);

  // Clean up SpeechRecognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Initialize SpeechRecognition instance
  const initSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) return true;

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setPermissionStatus("unsupported");
      return false;
    }

    const rec = new SpeechRecognitionClass();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-IN"; // Supports Indian English accents

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onend = () => {
      setIsListening(false);
      // Auto-restart if Voice SOS is active and not currently in countdown
      if (stateRef.current.isVoiceSOSActive && !stateRef.current.isCountdownActive) {
        try {
          rec.start();
        } catch (err) {
          console.warn("Speech recognition auto-restart failed:", err);
        }
      }
    };

    rec.onerror = (event: any) => {
      console.warn("Speech recognition error event:", event.error);
      if (event.error === "not-allowed") {
        setPermissionStatus("denied");
        setIsVoiceSOSActive(false);
        localStorage.setItem("voice_sos_active", "false");
        showToast({
          variant: "error",
          title: "Microphone Access Required",
          description: "Voice SOS requires microphone permission to listen for emergency keywords.",
        });
      }
    };

    rec.onresult = (event: any) => {
      const lastResultIndex = event.results.length - 1;
      const transcript = event.results[lastResultIndex][0].transcript || "";
      const cleaned = transcript.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();

      console.log("Recognized speech:", cleaned);

      // Ignore voice triggers if an SOS is already active in the app
      if (stateRef.current.hasActiveEmergency) {
        return;
      }

      if (stateRef.current.isCountdownActive) {
        // Listening for cancel keywords
        const matchedCancel = CANCEL_KEYWORDS.find((kw) => cleaned.includes(kw));
        if (matchedCancel) {
          console.log("Cancel voice keyword matched:", matchedCancel);
          handleCancelCountdown();
        }
      } else {
        // Listening for emergency keywords
        const matchedEmergency = EMERGENCY_KEYWORDS.find((kw) => cleaned.includes(kw));
        if (matchedEmergency) {
          console.log("Emergency voice keyword matched:", matchedEmergency);
          setRecognizedText(transcript);
          handleTriggerCountdown();
        }
      }
    };

    recognitionRef.current = rec;
    return true;
  }, [showToast]);

  // Start the actual SpeechRecognition engine
  const startRecognition = useCallback(() => {
    if (!recognitionRef.current && !initSpeechRecognition()) return;
    try {
      recognitionRef.current.start();
    } catch {
      // already running
    }
  }, [initSpeechRecognition]);

  // Stop SpeechRecognition engine
  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  // Request voice permission and enable feature
  const enableVoiceSOS = useCallback(async (): Promise<boolean> => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setPermissionStatus("unsupported");
      return false;
    }

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately, SpeechRecognition will handle its own stream
      stream.getTracks().forEach((track) => track.stop());

      setPermissionStatus("granted");
      setIsVoiceSOSActive(true);
      localStorage.setItem("voice_sos_active", "true");
      
      // Initialize and start recognition
      initSpeechRecognition();
      startRecognition();
      return true;
    } catch (err) {
      console.error("Microphone permission denied:", err);
      setPermissionStatus("denied");
      setIsVoiceSOSActive(false);
      localStorage.setItem("voice_sos_active", "false");
      showToast({
        variant: "warning",
        title: "Voice SOS Disabled",
        description: "Voice SOS requires microphone permission. Please check your browser settings.",
      });
      return false;
    }
  }, [initSpeechRecognition, startRecognition, showToast]);

  const disableVoiceSOS = useCallback(() => {
    setIsVoiceSOSActive(false);
    localStorage.setItem("voice_sos_active", "false");
    stopRecognition();
  }, [stopRecognition]);

  // Countdown timer logic
  const handleTriggerCountdown = useCallback(() => {
    setIsCountdownActive(true);
    setCountdown(10);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          // Trigger actual SOS activation sequence
          triggerSOSEvent();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleCancelCountdown = useCallback(() => {
    setIsCountdownActive(false);
    setCountdown(10);
    setRecognizedText("");

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    showToast({
      variant: "success",
      title: "SOS Cancelled",
      description: "Voice activated SOS countdown was cancelled.",
    });

    // Resume normal listening
    startRecognition();
  }, [showToast, startRecognition]);

  // Keep a ref for the trigger type so triggerSOSEvent (async) can read it
  const triggerTypeRef = useRef<"button" | "voice">("voice");

  // Actually invoke the Supabase SOS trigger logic
  const triggerSOSEvent = async (triggerType: "button" | "voice" = "voice") => {
    triggerTypeRef.current = triggerType;
    setIsCountdownActive(false);
    setCountdown(10);
    setRecognizedText("");

    try {
      const location = await getCurrentPosition();
      const nearby = await fetchNearbyPlaces(location);
      const nearestPolice = findNearestByType(location, nearby, "police");
      const nearestHospital = findNearestByType(location, nearby, "hospital");
      
      // Attempt to load active journey to link it
      let activeJourney = null;
      try {
        activeJourney = await fetchActiveJourney();
      } catch {
        // non-fatal
      }

      const newEvent = await activateEmergency.mutateAsync({
        lat: location.lat,
        lng: location.lng,
        journeyId: activeJourney?.id ?? null,
        nearestPoliceName: nearestPolice?.name,
        nearestHospitalName: nearestHospital?.name,
        destinationName: activeJourney?.destination_name ?? null,
        destinationLat: activeJourney?.destination_lat ?? null,
        destinationLng: activeJourney?.destination_lng ?? null,
        routeLabel: activeJourney ? "Active route" : null,
        wsiScore: activeJourney?.wsi_score ?? null,
        journeyStatus: activeJourney?.status ?? null,
      });

      // 📸 Fire-and-forget camera capture via singleton service
      captureSOSPhoto({
        emergencyEventId: newEvent?.id ?? null,
        triggerType: triggerTypeRef.current,
        lat: location.lat,
        lng: location.lng,
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

  // Sync state with SpeechRecognition instance on load
  useEffect(() => {
    if (isVoiceSOSActive) {
      // Check permission status via mediaDevices if supported
      navigator.permissions?.query?.({ name: "microphone" as any }).then((result) => {
        if (result.state === "granted") {
          setPermissionStatus("granted");
          startRecognition();
        } else if (result.state === "denied") {
          setPermissionStatus("denied");
          setIsVoiceSOSActive(false);
          localStorage.setItem("voice_sos_active", "false");
        } else {
          // If prompt, automatically request permission when visiting the site
          setPermissionStatus("prompt");
          enableVoiceSOS();
        }
      }).catch(() => {
        // Fallback for browsers that don't support permission query
        enableVoiceSOS();
      });
    }
  }, [isVoiceSOSActive, startRecognition, enableVoiceSOS]);

  return (
    <VoiceSOSContext.Provider
      value={{
        isVoiceSOSActive,
        isListening,
        permissionStatus,
        isCountdownActive,
        countdown,
        recognizedText,
        enableVoiceSOS,
        disableVoiceSOS,
        cancelCountdown: handleCancelCountdown,
      }}
    >
      {children}
    </VoiceSOSContext.Provider>
  );
}

export function useVoiceSOS() {
  const context = useContext(VoiceSOSContext);
  if (!context) {
    throw new Error("useVoiceSOS must be used within a VoiceSOSProvider");
  }
  return context;
}

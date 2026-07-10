import { useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useToast } from "@/contexts/ToastContext";

export default function App() {
  const isOnline = useOnlineStatus();
  const { showToast } = useToast();
  const prevOnline = useRef<boolean | null>(null);

  useEffect(() => {
    // Initialize the ref on the first run to the current status so we don't trigger a toast on mount
    if (prevOnline.current === null) {
      prevOnline.current = isOnline;
      return;
    }

    // Only show the toast when the online state actually changes
    if (prevOnline.current !== isOnline) {
      prevOnline.current = isOnline;
      showToast(
        isOnline
          ? { variant: "success", title: "Back online", description: "Your connection has been restored." }
          : {
              variant: "warning",
              title: "You're offline",
              description: "Some data may be out of date until your connection returns.",
            }
      );
    }
  }, [isOnline, showToast]);

  return <RouterProvider router={router} />;
}

import { useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useToast } from "@/contexts/ToastContext";

export default function App() {
  const isOnline = useOnlineStatus();
  const { showToast } = useToast();
  const hasMountedRef = useRef(false);

  useEffect(() => {
    // Skip the toast on initial mount — only react to actual transitions.
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    showToast(
      isOnline
        ? { variant: "success", title: "Back online", description: "Your connection has been restored." }
        : {
            variant: "warning",
            title: "You're offline",
            description: "Some data may be out of date until your connection returns.",
          }
    );
  }, [isOnline, showToast]);

  return <RouterProvider router={router} />;
}

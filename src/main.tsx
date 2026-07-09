import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ToastProvider } from "@/contexts/ToastContext";
import { RouteSearchProvider } from "@/contexts/RouteSearchContext";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouteSearchProvider>
          <App />
        </RouteSearchProvider>
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>
);

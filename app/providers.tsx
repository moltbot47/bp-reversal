"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/toast-provider";

function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("SW registered:", reg.scope);
        })
        .catch((err) => {
          console.log("SW registration failed:", err);
        });
    }
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <ServiceWorkerRegistration />
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [onboardChecked, setOnboardChecked] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Check if user has completed onboarding
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/reminders")
        .then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        })
        .then((data) => {
          if (!data.onboarded) {
            router.push("/signup");
          } else {
            setOnboardChecked(true);
          }
        })
        .catch(() => {
          setOnboardChecked(true);
        });
    }
  }, [status, router]);

  if (status === "loading" || (status === "authenticated" && !onboardChecked)) {
    return (
      <div className="min-h-screen bg-[#EEEFE9] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#EB9D2A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-[#EEEFE9]">
      <div className="max-w-lg mx-auto pb-20">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}

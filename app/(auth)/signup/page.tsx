"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Clock, Bell, ArrowRight, ArrowLeft, Smartphone } from "lucide-react";

type Step = "name" | "waketime" | "push";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [wakeUpTime, setWakeUpTime] = useState("06:00");
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);

    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, wakeUpTime }),
    });

    // Request push permission
    if ("Notification" in window && "serviceWorker" in navigator) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        try {
          const reg = await navigator.serviceWorker.ready;
          const subscription = await reg.pushManager.subscribe({
            userVisuallyInactive: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          } as PushSubscriptionOptionsInit);

          await fetch("/api/push/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscription }),
          });
        } catch {
          // Push subscription failed, continue anyway
        }
      }
    }

    setLoading(false);
    router.push("/today");
  };

  return (
    <div className="min-h-screen bg-[#EEEFE9] flex items-center justify-center p-4">
      <div className="bg-[#FDFDF8] rounded-xl shadow-sm p-8 max-w-md w-full">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["name", "waketime", "push"] as Step[]).map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-colors ${
                s === step ? "bg-[#EB9D2A]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {step === "name" && (
          <div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1D2939] text-center mb-2">
              What should we call you?
            </h2>
            <p className="text-[#667085] text-center mb-6">
              We&apos;ll use this in your reminders.
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your first name"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-[#1D2939] placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#EB9D2A] mb-4"
            />
            <button
              onClick={() => setStep("waketime")}
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#EB9D2A] text-white font-semibold rounded-lg shadow-[0_2px_0_0_#C4800F] hover:bg-[#D4891F] active:translate-y-[1px] active:shadow-[0_1px_0_0_#C4800F] disabled:opacity-50 transition-all"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === "waketime" && (
          <div>
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1D2939] text-center mb-2">
              When do you wake up?
            </h2>
            <p className="text-[#667085] text-center mb-6">
              We&apos;ll time your reminders based on this.
            </p>
            <input
              type="time"
              value={wakeUpTime}
              onChange={(e) => setWakeUpTime(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-[#1D2939] text-center text-xl focus:outline-none focus:ring-2 focus:ring-[#EB9D2A] mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setStep("name")}
                className="flex items-center justify-center gap-1 py-3 px-4 bg-white border border-gray-200 text-[#667085] font-medium rounded-lg hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStep("push")}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#EB9D2A] text-white font-semibold rounded-lg shadow-[0_2px_0_0_#C4800F] hover:bg-[#D4891F] active:translate-y-[1px] active:shadow-[0_1px_0_0_#C4800F] transition-all"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === "push" && (
          <div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1D2939] text-center mb-2">
              Stay on track with reminders
            </h2>
            <p className="text-[#667085] text-center mb-4">
              Get gentle reminders at each time block. Never guilt-tripping, always encouraging.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    iPhone users
                  </p>
                  <p className="text-sm text-amber-700">
                    Tap the share button, then &quot;Add to Home Screen&quot; for push notifications to work.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("waketime")}
                className="flex items-center justify-center gap-1 py-3 px-4 bg-white border border-gray-200 text-[#667085] font-medium rounded-lg hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#EB9D2A] text-white font-semibold rounded-lg shadow-[0_2px_0_0_#C4800F] hover:bg-[#D4891F] active:translate-y-[1px] active:shadow-[0_1px_0_0_#C4800F] disabled:opacity-50 transition-all"
              >
                {loading ? "Setting up..." : "Let's go!"}
              </button>
            </div>

            <button
              onClick={handleComplete}
              className="w-full mt-3 text-sm text-[#667085] hover:text-[#1D2939] transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

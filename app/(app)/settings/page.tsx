"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useUserStore } from "@/stores/user-store";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Clock, Bell, Heart, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { name, wakeUpTime, pushEnabled, setUser, updateSettings } =
    useUserStore();
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState("");
  const [editWakeTime, setEditWakeTime] = useState("06:00");

  useEffect(() => {
    fetch("/api/reminders")
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
        setEditName(data.name || "");
        setEditWakeTime(data.wakeUpTime || "06:00");
        setLoading(false);
      });
  }, [setUser]);

  const handleSave = () => {
    updateSettings({
      name: editName,
      wakeUpTime: editWakeTime,
    });
  };

  const togglePush = async () => {
    if (!pushEnabled) {
      // Request permission
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          try {
            const reg = await navigator.serviceWorker.ready;
            const subscription = await reg.pushManager.subscribe({
              userVisuallyInactive: true,
              applicationServerKey:
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            } as PushSubscriptionOptionsInit);

            await fetch("/api/push/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ subscription }),
            });

            updateSettings({ pushEnabled: true });
          } catch {
            // Push subscription failed
          }
        }
      }
    } else {
      updateSettings({ pushEnabled: false });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[#EB9D2A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Header title="Settings" />

      <div className="px-4 space-y-3 py-2">
        {/* Profile */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-[#667085]" />
            <h3 className="text-sm font-semibold text-[#1D2939]">Profile</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#667085] mb-1">
                Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleSave}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[#1D2939] focus:outline-none focus:ring-2 focus:ring-[#EB9D2A]"
              />
            </div>
          </div>
        </Card>

        {/* Wake Time */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-[#667085]" />
            <h3 className="text-sm font-semibold text-[#1D2939]">
              Wake-up Time
            </h3>
          </div>
          <input
            type="time"
            value={editWakeTime}
            onChange={(e) => setEditWakeTime(e.target.value)}
            onBlur={handleSave}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[#1D2939] text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#EB9D2A]"
          />
          <p className="text-xs text-[#667085] mt-2">
            Reminders are timed relative to when you wake up.
          </p>
        </Card>

        {/* Notifications */}
        <Card padding="lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#667085]" />
              <div>
                <h3 className="text-sm font-semibold text-[#1D2939]">
                  Push Notifications
                </h3>
                <p className="text-xs text-[#667085]">
                  Gentle reminders at each time block
                </p>
              </div>
            </div>
            <button
              onClick={togglePush}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                pushEnabled ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  pushEnabled ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Donate */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-semibold text-[#1D2939]">
              Support This Project
            </h3>
          </div>
          <p className="text-sm text-[#667085] mb-3">
            BP Reversal is 100% free. If it&apos;s helping you, consider buying me a
            coffee.
          </p>
          <a
            href="https://buymeacoffee.com/bpreversal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#EB9D2A] hover:underline"
          >
            Buy me a coffee
          </a>
        </Card>

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

"use client";

import { create } from "zustand";

interface UserState {
  name: string | null;
  email: string | null;
  wakeUpTime: string;
  timezone: string;
  protocolStartDate: string | null;
  pushEnabled: boolean;
  onboarded: boolean;

  setUser: (user: Partial<UserState>) => void;
  updateSettings: (settings: {
    name?: string;
    wakeUpTime?: string;
    pushEnabled?: boolean;
  }) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: null,
  email: null,
  wakeUpTime: "06:00",
  timezone: "America/Chicago",
  protocolStartDate: null,
  pushEnabled: false,
  onboarded: false,

  setUser: (user) => set(user),

  updateSettings: (settings) => {
    set(settings);

    fetch("/api/reminders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    }).catch(() => {
      // Silently fail — optimistic update already applied
    });
  },
}));

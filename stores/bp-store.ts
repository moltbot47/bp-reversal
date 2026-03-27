"use client";

import { create } from "zustand";
import type { BPEntryData } from "@/lib/types";

interface BPState {
  entries: BPEntryData[];
  loading: boolean;
  newMilestones: string[];

  setEntries: (entries: BPEntryData[]) => void;
  addEntry: (entry: BPEntryData) => void;
  setLoading: (loading: boolean) => void;
  addMilestone: (milestone: string) => void;
  clearMilestones: () => void;
  getLatestEntry: () => BPEntryData | null;
}

export const useBPStore = create<BPState>((set, get) => ({
  entries: [],
  loading: true,
  newMilestones: [],

  setEntries: (entries) => set({ entries, loading: false }),

  addEntry: (entry) =>
    set((state) => ({
      entries: [entry, ...state.entries],
    })),

  setLoading: (loading) => set({ loading }),

  addMilestone: (milestone) =>
    set((state) => ({
      newMilestones: [...state.newMilestones, milestone],
    })),

  clearMilestones: () => set({ newMilestones: [] }),

  getLatestEntry: () => {
    const { entries } = get();
    return entries.length > 0 ? entries[0] : null;
  },
}));

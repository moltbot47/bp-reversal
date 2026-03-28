"use client";

import { create } from "zustand";
import type { ChecklistItemWithStatus, TimeBlockGroup } from "@/lib/types";
import { TIMEBLOCK_LABELS, TIMEBLOCK_RANGES } from "@/lib/types";
import type { TimeBlock } from "@/generated/prisma/client";

interface ChecklistState {
  items: ChecklistItemWithStatus[];
  loading: boolean;
  dayNumber: number;
  phase: number;

  setItems: (items: ChecklistItemWithStatus[]) => void;
  setDayInfo: (dayNumber: number, phase: number) => void;
  toggleItem: (slug: string) => void;
  setLoading: (loading: boolean) => void;
  getTimeBlockGroups: () => TimeBlockGroup[];
  getDailyProgress: () => number;
}

export const useChecklistStore = create<ChecklistState>((set, get) => ({
  items: [],
  loading: true,
  dayNumber: 1,
  phase: 1,

  setItems: (items) => set({ items, loading: false }),

  setDayInfo: (dayNumber, phase) => set({ dayNumber, phase }),

  toggleItem: (slug) => {
    const { items } = get();
    const item = items.find((i) => i.slug === slug);
    if (!item || item.locked) return;

    const newCompleted = !item.completed;
    // Snapshot before optimistic update for safe rollback
    const snapshot = items;

    // Optimistic update
    set({
      items: items.map((i) =>
        i.slug === slug ? { ...i, completed: newCompleted } : i
      ),
    });

    // Sync to server in background
    fetch("/api/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, completed: newCompleted }),
    }).catch(() => {
      // Rollback to snapshot on error
      set({ items: snapshot });
    });
  },

  setLoading: (loading) => set({ loading }),

  getTimeBlockGroups: () => {
    const { items } = get();
    const blocks: TimeBlock[] = ["MORNING", "MIDDAY", "AFTERNOON", "EVENING"];

    return blocks.map((tb) => ({
      timeBlock: tb,
      label: TIMEBLOCK_LABELS[tb],
      timeRange: TIMEBLOCK_RANGES[tb],
      items: items
        .filter((i) => i.timeBlock === tb)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));
  },

  getDailyProgress: () => {
    const { items } = get();
    const unlocked = items.filter((i) => !i.locked);
    if (unlocked.length === 0) return 0;
    const completed = unlocked.filter((i) => i.completed).length;
    return Math.round((completed / unlocked.length) * 100);
  },
}));

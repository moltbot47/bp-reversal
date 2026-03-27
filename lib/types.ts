import type { Pillar, TimeBlock, BPPeriod } from "@/generated/prisma/client";

export type { Pillar, TimeBlock, BPPeriod };

export interface ChecklistItemDef {
  slug: string;
  title: string;
  description: string | null;
  pillar: Pillar | null;
  timeBlock: TimeBlock;
  phase: number;
  sortOrder: number;
}

export interface ChecklistItemWithStatus extends ChecklistItemDef {
  completed: boolean;
  locked: boolean;
}

export interface TimeBlockGroup {
  timeBlock: TimeBlock;
  label: string;
  timeRange: string;
  items: ChecklistItemWithStatus[];
}

export interface PillarStats {
  pillar: Pillar;
  label: string;
  color: string;
  todayCompleted: number;
  todayTotal: number;
  todayPercent: number;
  weeklyAverage: number;
}

export interface DashboardData {
  pillars: PillarStats[];
  overallPercent: number;
  streak: { current: number; longest: number };
  weeklyGrid: { date: string; percent: number }[];
}

export interface BPEntryData {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number | null;
  period: BPPeriod;
  date: string;
  notes: string | null;
  createdAt: string;
}

export interface BPMilestone {
  key: string;
  label: string;
  systolic: number;
  diastolic: number;
  message: string;
}

export const PILLAR_COLORS: Record<string, string> = {
  VASCULAR: "#EF4444",
  NERVOUS: "#3B82F6",
  BLOOD: "#22C55E",
  KIDNEY: "#A855F7",
};

export const PILLAR_LABELS: Record<string, string> = {
  VASCULAR: "Vascular",
  NERVOUS: "Nervous",
  BLOOD: "Blood",
  KIDNEY: "Kidney",
};

export const TIMEBLOCK_LABELS: Record<string, string> = {
  MORNING: "Morning",
  MIDDAY: "Midday",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
};

export const TIMEBLOCK_RANGES: Record<string, string> = {
  MORNING: "6 - 8 AM",
  MIDDAY: "12 - 2 PM",
  AFTERNOON: "3 - 5 PM",
  EVENING: "6 - 9 PM",
};

import type { BPMilestone } from "@/lib/types";

export const BP_MILESTONES: BPMilestone[] = [
  {
    key: "below-140-90",
    label: "Below 140/90",
    systolic: 140,
    diastolic: 90,
    message: "Your blood pressure is now below 140/90! Stage 1 hypertension threshold crossed.",
  },
  {
    key: "below-130-80",
    label: "Below 130/80",
    systolic: 130,
    diastolic: 80,
    message: "Amazing! Below 130/80 — you're in the elevated range now, not hypertensive!",
  },
  {
    key: "below-120-80",
    label: "Below 120/80",
    systolic: 120,
    diastolic: 80,
    message: "Incredible! Below 120/80 — that's normal blood pressure! You did it!",
  },
];

export function checkMilestones(
  systolic: number,
  diastolic: number,
  achievedMilestones: Set<string>
): BPMilestone[] {
  const newMilestones: BPMilestone[] = [];

  for (const milestone of BP_MILESTONES) {
    if (achievedMilestones.has(milestone.key)) continue;
    if (systolic < milestone.systolic && diastolic < milestone.diastolic) {
      newMilestones.push(milestone);
    }
  }

  return newMilestones;
}

export function getBPCategory(
  systolic: number,
  diastolic: number
): { label: string; color: string } {
  if (systolic < 120 && diastolic < 80)
    return { label: "Normal", color: "#22C55E" };
  if (systolic < 130 && diastolic < 80)
    return { label: "Elevated", color: "#EAB308" };
  if (systolic < 140 || diastolic < 90)
    return { label: "Stage 1", color: "#F97316" };
  return { label: "Stage 2", color: "#EF4444" };
}

export function getBPTrend(
  entries: { systolic: number; diastolic: number }[]
): "up" | "down" | "stable" {
  if (entries.length < 2) return "stable";
  const recent = entries.slice(-3);
  const older = entries.slice(-6, -3);
  if (older.length === 0) return "stable";

  const recentAvg =
    recent.reduce((s, e) => s + e.systolic, 0) / recent.length;
  const olderAvg =
    older.reduce((s, e) => s + e.systolic, 0) / older.length;

  const diff = recentAvg - olderAvg;
  if (diff < -3) return "down";
  if (diff > 3) return "up";
  return "stable";
}

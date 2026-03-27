import type { ChecklistItemWithStatus, PillarStats } from "@/lib/types";
import { PILLAR_COLORS, PILLAR_LABELS } from "@/lib/types";
import type { Pillar } from "@/generated/prisma/client";

export function calculateDailyProgress(
  items: ChecklistItemWithStatus[]
): number {
  const unlocked = items.filter((i) => !i.locked);
  if (unlocked.length === 0) return 0;
  const completed = unlocked.filter((i) => i.completed).length;
  return Math.round((completed / unlocked.length) * 100);
}

export function calculatePillarStats(
  items: ChecklistItemWithStatus[],
  weeklyCompletions?: Map<string, Set<string>>
): PillarStats[] {
  const pillars: Pillar[] = ["VASCULAR", "NERVOUS", "BLOOD", "KIDNEY"];

  return pillars.map((pillar) => {
    const pillarItems = items.filter(
      (i) => i.pillar === pillar && !i.locked
    );
    const todayCompleted = pillarItems.filter((i) => i.completed).length;
    const todayTotal = pillarItems.length;
    const todayPercent =
      todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

    let weeklyAverage = 0;
    if (weeklyCompletions) {
      const dailyPercents: number[] = [];
      weeklyCompletions.forEach((completedSlugs) => {
        const dayCompleted = pillarItems.filter((i) =>
          completedSlugs.has(i.slug)
        ).length;
        dailyPercents.push(
          todayTotal > 0
            ? Math.round((dayCompleted / todayTotal) * 100)
            : 0
        );
      });
      weeklyAverage =
        dailyPercents.length > 0
          ? Math.round(
              dailyPercents.reduce((a, b) => a + b, 0) / dailyPercents.length
            )
          : 0;
    }

    return {
      pillar,
      label: PILLAR_LABELS[pillar],
      color: PILLAR_COLORS[pillar],
      todayCompleted,
      todayTotal,
      todayPercent,
      weeklyAverage,
    };
  });
}

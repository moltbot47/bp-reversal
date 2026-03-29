import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDayNumber, getCurrentPhase } from "@/lib/checklist/phases";
import { CHECKLIST_ITEMS } from "@/lib/checklist/items";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { protocolStartDate: true },
  });

  const startDate = user?.protocolStartDate;
  const dayNumber = getDayNumber(startDate ?? null);
  const phase = getCurrentPhase(startDate ?? null);

  // Get all completions for the entire protocol
  const allCompletions = await prisma.checklistCompletion.findMany({
    where: { userId: session.user.id },
    select: { itemSlug: true, date: true },
    orderBy: { date: "asc" },
  });

  // Get all BP entries
  const bpEntries = await prisma.bPEntry.findMany({
    where: { userId: session.user.id },
    select: { systolic: true, diastolic: true, date: true, period: true },
    orderBy: { date: "asc" },
  });

  // Get streak
  const streak = await prisma.streak.findUnique({
    where: { userId: session.user.id },
  });

  // Build daily map for up to 90 days
  const dailyMap: Record<string, {
    date: string;
    dayNumber: number;
    phase: number;
    completed: string[];
    totalUnlocked: number;
    percent: number;
    bpAm: { systolic: number; diastolic: number } | null;
    bpPm: { systolic: number; diastolic: number } | null;
  }> = {};

  // Determine the range: from protocol start (or first completion) to today
  const protocolStart = startDate
    ? new Date(startDate)
    : allCompletions.length > 0
    ? new Date(allCompletions[0].date)
    : new Date();

  const today = new Date();
  const totalDays = Math.min(
    90,
    Math.floor((today.getTime() - protocolStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(protocolStart);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const thisDayNumber = i + 1;
    const thisPhase = thisDayNumber <= 30 ? 1 : thisDayNumber <= 60 ? 2 : 3;

    // Count unlocked items for this day's phase
    const unlockedCount = CHECKLIST_ITEMS.filter((item) => item.phase <= thisPhase).length;

    dailyMap[dateStr] = {
      date: dateStr,
      dayNumber: thisDayNumber,
      phase: thisPhase,
      completed: [],
      totalUnlocked: unlockedCount,
      percent: 0,
      bpAm: null,
      bpPm: null,
    };
  }

  // Fill in completions
  for (const c of allCompletions) {
    if (dailyMap[c.date]) {
      dailyMap[c.date].completed.push(c.itemSlug);
    }
  }

  // Fill in BP entries
  for (const bp of bpEntries) {
    if (dailyMap[bp.date]) {
      if (bp.period === "AM") {
        dailyMap[bp.date].bpAm = { systolic: bp.systolic, diastolic: bp.diastolic };
      } else {
        dailyMap[bp.date].bpPm = { systolic: bp.systolic, diastolic: bp.diastolic };
      }
    }
  }

  // Calculate percents
  for (const dateStr of Object.keys(dailyMap)) {
    const day = dailyMap[dateStr];
    day.percent = day.totalUnlocked > 0
      ? Math.round((day.completed.length / day.totalUnlocked) * 100)
      : 0;
  }

  // Weekly aggregates
  const days = Object.values(dailyMap);
  const weeks: { weekNumber: number; startDate: string; endDate: string; avgPercent: number; daysActive: number; totalDays: number }[] = [];
  for (let w = 0; w < Math.ceil(days.length / 7); w++) {
    const weekDays = days.slice(w * 7, (w + 1) * 7);
    const avgPercent = weekDays.length > 0
      ? Math.round(weekDays.reduce((s, d) => s + d.percent, 0) / weekDays.length)
      : 0;
    const daysActive = weekDays.filter((d) => d.percent > 0).length;
    weeks.push({
      weekNumber: w + 1,
      startDate: weekDays[0]?.date || "",
      endDate: weekDays[weekDays.length - 1]?.date || "",
      avgPercent,
      daysActive,
      totalDays: weekDays.length,
    });
  }

  // Monthly stats
  const monthlyStats = {
    totalDaysTracked: days.length,
    daysActive: days.filter((d) => d.percent > 0).length,
    avgPercent: days.length > 0
      ? Math.round(days.reduce((s, d) => s + d.percent, 0) / days.length)
      : 0,
    perfectDays: days.filter((d) => d.percent === 100).length,
  };

  return Response.json({
    days,
    weeks,
    monthlyStats,
    dayNumber,
    phase,
    streak: {
      current: streak?.currentStreak ?? 0,
      longest: streak?.longestStreak ?? 0,
    },
    protocolStartDate: startDate?.toISOString() || null,
  });
}

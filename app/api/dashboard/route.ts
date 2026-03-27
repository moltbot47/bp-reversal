import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getItemsWithStatus } from "@/lib/checklist/phases";
import { calculatePillarStats } from "@/lib/checklist/scoring";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { protocolStartDate: true },
  });

  const today = new Date().toISOString().split("T")[0];

  // Today's completions
  const todayCompletions = await prisma.checklistCompletion.findMany({
    where: { userId: session.user.id, date: today },
    select: { itemSlug: true },
  });
  const completedSlugs = new Set(todayCompletions.map((c) => c.itemSlug));
  const items = getItemsWithStatus(user?.protocolStartDate ?? null, completedSlugs);

  // Last 7 days completions
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekCompletions = await prisma.checklistCompletion.findMany({
    where: {
      userId: session.user.id,
      date: { gte: sevenDaysAgo.toISOString().split("T")[0] },
    },
    select: { itemSlug: true, date: true },
  });

  const weeklyByDate = new Map<string, Set<string>>();
  for (const c of weekCompletions) {
    if (!weeklyByDate.has(c.date)) weeklyByDate.set(c.date, new Set());
    weeklyByDate.get(c.date)!.add(c.itemSlug);
  }

  const pillars = calculatePillarStats(items, weeklyByDate);

  // Streak
  const streak = await prisma.streak.findUnique({
    where: { userId: session.user.id },
  });

  // Weekly grid
  const weeklyGrid: { date: string; percent: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const daySlugs = weeklyByDate.get(dateStr) || new Set();
    const unlocked = items.filter((it) => !it.locked);
    const pct =
      unlocked.length > 0
        ? Math.round(
            (unlocked.filter((it) => daySlugs.has(it.slug)).length /
              unlocked.length) *
              100
          )
        : 0;
    weeklyGrid.push({ date: dateStr, percent: pct });
  }

  // Overall percent
  const unlocked = items.filter((i) => !i.locked);
  const overallPercent =
    unlocked.length > 0
      ? Math.round(
          (unlocked.filter((i) => i.completed).length / unlocked.length) * 100
        )
      : 0;

  return Response.json({
    pillars,
    overallPercent,
    streak: {
      current: streak?.currentStreak ?? 0,
      longest: streak?.longestStreak ?? 0,
    },
    weeklyGrid,
  });
}

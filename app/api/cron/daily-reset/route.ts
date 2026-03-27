import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUnlockedItems } from "@/lib/checklist/phases";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const users = await prisma.user.findMany({
    where: { onboarded: true },
    select: { id: true, protocolStartDate: true },
  });

  let updated = 0;

  for (const user of users) {
    const unlockedItems = getUnlockedItems(user.protocolStartDate);
    const completions = await prisma.checklistCompletion.count({
      where: { userId: user.id, date: yesterdayStr },
    });

    // Consider a day "active" if they completed at least 50% of unlocked items
    const threshold = Math.floor(unlockedItems.length * 0.5);
    const wasActive = completions >= threshold;

    const streak = await prisma.streak.findUnique({
      where: { userId: user.id },
    });

    if (!streak) {
      await prisma.streak.create({
        data: {
          userId: user.id,
          currentStreak: wasActive ? 1 : 0,
          longestStreak: wasActive ? 1 : 0,
          lastActiveDate: wasActive ? yesterdayStr : null,
        },
      });
    } else if (wasActive) {
      const newStreak = streak.currentStreak + 1;
      await prisma.streak.update({
        where: { userId: user.id },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastActiveDate: yesterdayStr,
        },
      });
    } else {
      await prisma.streak.update({
        where: { userId: user.id },
        data: { currentStreak: 0 },
      });
    }

    updated++;
  }

  return Response.json({ updated });
}

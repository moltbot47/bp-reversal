import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // Protect with CRON_SECRET (reuse as admin key)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    onboardedUsers,
    pushEnabledUsers,
    todayActiveUsers,
    weeklyActiveUsers,
    totalCompletions,
    totalBPEntries,
    recentSignups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { onboarded: true } }),
    prisma.user.count({ where: { pushEnabled: true } }),
    prisma.checklistCompletion.groupBy({
      by: ["userId"],
      where: { date: today },
    }).then((r) => r.length),
    prisma.checklistCompletion.groupBy({
      by: ["userId"],
      where: { date: { gte: sevenDaysAgo.toISOString().split("T")[0] } },
    }).then((r) => r.length),
    prisma.checklistCompletion.count(),
    prisma.bPEntry.count(),
    prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { email: true, createdAt: true, onboarded: true, name: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return Response.json({
    timestamp: now.toISOString(),
    users: {
      total: totalUsers,
      onboarded: onboardedUsers,
      pushEnabled: pushEnabledUsers,
      activeToday: todayActiveUsers,
      activeLast7Days: weeklyActiveUsers,
    },
    activity: {
      totalChecklistCompletions: totalCompletions,
      totalBPEntries: totalBPEntries,
    },
    recentSignups: recentSignups.map((u) => ({
      email: u.email,
      name: u.name,
      onboarded: u.onboarded,
      signedUp: u.createdAt.toISOString(),
    })),
  });
}

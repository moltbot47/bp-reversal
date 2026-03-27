import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkMilestones } from "@/lib/bp/milestones";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await prisma.bPEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 90,
  });

  return Response.json({ entries });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { systolic, diastolic, pulse, period, notes } = await request.json();
  const today = new Date().toISOString().split("T")[0];

  const entry = await prisma.bPEntry.upsert({
    where: {
      userId_date_period: {
        userId: session.user.id,
        date: today,
        period,
      },
    },
    update: { systolic, diastolic, pulse, notes },
    create: {
      userId: session.user.id,
      systolic,
      diastolic,
      pulse,
      period,
      date: today,
      notes,
    },
  });

  // Check milestones
  const achieved = await prisma.milestoneAchievement.findMany({
    where: { userId: session.user.id },
    select: { milestone: true },
  });
  const achievedSet = new Set(achieved.map((a) => a.milestone));
  const newMilestones = checkMilestones(systolic, diastolic, achievedSet);

  for (const m of newMilestones) {
    await prisma.milestoneAchievement.create({
      data: { userId: session.user.id, milestone: m.key },
    });
  }

  return Response.json({
    entry,
    newMilestones: newMilestones.map((m) => ({
      key: m.key,
      message: m.message,
    })),
  });
}

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJSON } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await parseJSON<{ name: string; wakeUpTime: string; timezone?: string }>(request);
  if ("error" in result) return result.error;
  const { name, wakeUpTime, timezone: clientTimezone } = result.data;
  const timezone = clientTimezone || "America/Chicago";

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      wakeUpTime: wakeUpTime || "06:00",
      timezone,
      protocolStartDate: new Date(),
      onboarded: true,
    },
  });

  // Create initial streak record
  await prisma.streak.upsert({
    where: { userId: session.user.id },
    update: {},
    create: {
      userId: session.user.id,
      currentStreak: 0,
      longestStreak: 0,
    },
  });

  return Response.json({ ok: true });
}

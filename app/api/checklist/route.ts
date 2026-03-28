import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJSON } from "@/lib/api-utils";
import { getItemsWithStatus, getDayNumber, getCurrentPhase } from "@/lib/checklist/phases";

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

  const completions = await prisma.checklistCompletion.findMany({
    where: { userId: session.user.id, date: today },
    select: { itemSlug: true },
  });

  const completedSlugs = new Set(completions.map((c) => c.itemSlug));
  const items = getItemsWithStatus(user?.protocolStartDate ?? null, completedSlugs);
  const dayNumber = getDayNumber(user?.protocolStartDate ?? null);
  const phase = getCurrentPhase(user?.protocolStartDate ?? null);

  return Response.json({ items, dayNumber, phase });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await parseJSON<{ slug: string; completed: boolean }>(request);
  if ("error" in result) return result.error;
  const { slug, completed } = result.data;
  const today = new Date().toISOString().split("T")[0];

  if (completed) {
    await prisma.checklistCompletion.upsert({
      where: {
        userId_itemSlug_date: {
          userId: session.user.id,
          itemSlug: slug,
          date: today,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        itemSlug: slug,
        date: today,
      },
    });
  } else {
    await prisma.checklistCompletion.deleteMany({
      where: {
        userId: session.user.id,
        itemSlug: slug,
        date: today,
      },
    });
  }

  return Response.json({ ok: true });
}

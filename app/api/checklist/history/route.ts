import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const startDate = sevenDaysAgo.toISOString().split("T")[0];

  const completions = await prisma.checklistCompletion.findMany({
    where: {
      userId: session.user.id,
      date: { gte: startDate },
    },
    select: { itemSlug: true, date: true },
  });

  // Group by date
  const byDate: Record<string, string[]> = {};
  for (const c of completions) {
    if (!byDate[c.date]) byDate[c.date] = [];
    byDate[c.date].push(c.itemSlug);
  }

  return Response.json({ history: byDate });
}

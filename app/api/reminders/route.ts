import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJSON } from "@/lib/api-utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      wakeUpTime: true,
      timezone: true,
      pushEnabled: true,
      onboarded: true,
      protocolStartDate: true,
    },
  });

  return Response.json(user);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await parseJSON(request);
  if ("error" in result) return result.error;
  const data = result.data;
  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.wakeUpTime !== undefined) updateData.wakeUpTime = data.wakeUpTime;
  if (data.pushEnabled !== undefined) updateData.pushEnabled = data.pushEnabled;

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  });

  return Response.json({ ok: true });
}

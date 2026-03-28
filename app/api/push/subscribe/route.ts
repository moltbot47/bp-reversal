import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJSON } from "@/lib/api-utils";
import type { Prisma } from "@/generated/prisma/client";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await parseJSON<{ subscription: Record<string, unknown> }>(request);
  if ("error" in result) return result.error;
  const { subscription } = result.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      pushSubscription: subscription as Prisma.InputJsonValue,
      pushEnabled: true,
    },
  });

  return Response.json({ ok: true });
}

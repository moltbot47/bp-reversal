import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subscription } = await request.json();

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      pushSubscription: subscription,
      pushEnabled: true,
    },
  });

  return Response.json({ ok: true });
}

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { sendPushNotification } from "@/lib/notifications/push";
import { shouldSendReminder } from "@/lib/notifications/scheduler";
import { getNotificationMessage } from "@/lib/notifications/templates";
import { getDayNumber } from "@/lib/checklist/phases";
import type { PushSubscription } from "web-push";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: { pushEnabled: true, pushSubscription: { not: Prisma.JsonNull } },
    select: {
      id: true,
      wakeUpTime: true,
      timezone: true,
      protocolStartDate: true,
      pushSubscription: true,
    },
  });

  let sent = 0;
  let skipped = 0;

  for (const user of users) {
    const { shouldSend, timeBlock } = shouldSendReminder(
      user.wakeUpTime,
      user.timezone
    );

    if (!shouldSend || !timeBlock || !user.pushSubscription) {
      skipped++;
      continue;
    }

    const dayNumber = getDayNumber(user.protocolStartDate);
    const { title, body } = getNotificationMessage(timeBlock, dayNumber);

    const success = await sendPushNotification(
      user.pushSubscription as unknown as PushSubscription,
      { title, body, icon: "/icons/icon-192x192.png", url: "/today" }
    );

    if (success) {
      sent++;
    } else {
      // Subscription expired, disable push
      await prisma.user.update({
        where: { id: user.id },
        data: { pushEnabled: false, pushSubscription: Prisma.JsonNull },
      });
      skipped++;
    }
  }

  return Response.json({ sent, skipped, total: users.length });
}

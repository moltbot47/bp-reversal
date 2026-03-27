import webpush from "web-push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY && VAPID_PUBLIC_KEY !== "placeholder") {
  webpush.setVapidDetails(
    "mailto:noreply@bpreversal.com",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: { title: string; body: string; icon?: string; url?: string }
): Promise<boolean> {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
    return true;
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode === 410 || statusCode === 404) {
      return false; // Subscription expired
    }
    console.error("Push notification error:", error);
    return false;
  }
}

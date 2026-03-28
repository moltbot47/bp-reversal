import webpush from "web-push";

let vapidConfigured = false;

function ensureVapidConfigured() {
  if (vapidConfigured) return true;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey || publicKey === "placeholder") return false;
  try {
    webpush.setVapidDetails(
      "mailto:noreply@bpreversal.com",
      publicKey,
      privateKey
    );
    vapidConfigured = true;
    return true;
  } catch {
    console.error("Failed to configure VAPID keys");
    return false;
  }
}

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: { title: string; body: string; icon?: string; url?: string }
): Promise<boolean> {
  if (!ensureVapidConfigured()) return false;
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
    return true;
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode === 410 || statusCode === 404) {
      return false;
    }
    console.error("Push notification error:", error);
    return false;
  }
}

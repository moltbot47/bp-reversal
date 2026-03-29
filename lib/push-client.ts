"use client";

export async function subscribeToPush(): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!("Notification" in window)) {
    return { success: false, error: "Your browser doesn't support notifications" };
  }

  if (!("serviceWorker" in navigator)) {
    return { success: false, error: "Service workers not supported" };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { success: false, error: "Notification permission denied" };
  }

  try {
    // Fetch VAPID key from server (not build-time env var)
    const keyRes = await fetch("/api/push/vapid-key");
    if (!keyRes.ok) {
      return { success: false, error: "Push notifications not configured yet" };
    }
    const { key } = await keyRes.json();

    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: key,
    });

    const subRes = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription }),
    });

    if (!subRes.ok) {
      return { success: false, error: "Failed to save subscription" };
    }

    return { success: true };
  } catch (err) {
    console.error("Push subscription error:", err);
    return { success: false, error: "Something went wrong. Try again." };
  }
}

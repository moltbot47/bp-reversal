import type { TimeBlock } from "@/lib/types";

const MORNING_MESSAGES = [
  "Good morning! Start with your breathing and water.",
  "Rise and shine! A few deep breaths set the tone for the day.",
  "New day, fresh start. Your morning routine is waiting.",
  "Good morning! Your body thanks you for showing up today.",
];

const MIDDAY_MESSAGES = [
  "Quick midday check-in. A few small actions make a big difference.",
  "Halfway through the day! Time for your midday items.",
  "Lunchtime is protocol time. Keep the momentum going.",
  "Midday reminder: your health is worth these few minutes.",
];

const AFTERNOON_MESSAGES = [
  "Afternoon reset. Just a couple of items to keep momentum.",
  "Afternoon check-in! Almost through today's list.",
  "A short break for your health. You've got this.",
];

const EVENING_MESSAGES = [
  "Winding down? Evening routine sets you up for tomorrow.",
  "Almost done for today! Finish strong with your evening items.",
  "Evening wind-down time. Rest and recovery matter.",
  "Last items of the day. You're building something powerful.",
];

const MISSED_DAY_MESSAGES = [
  "No worries about yesterday. Today is a fresh start.",
  "Every day is a new opportunity. Pick up where you left off.",
  "Welcome back! Your protocol is ready when you are.",
];

const messageMap: Record<string, string[]> = {
  MORNING: MORNING_MESSAGES,
  MIDDAY: MIDDAY_MESSAGES,
  AFTERNOON: AFTERNOON_MESSAGES,
  EVENING: EVENING_MESSAGES,
};

export function getNotificationMessage(
  timeBlock: TimeBlock,
  dayNumber: number
): { title: string; body: string } {
  const messages = messageMap[timeBlock] || MORNING_MESSAGES;
  const body = messages[Math.floor(Math.random() * messages.length)];

  return {
    title: `Day ${dayNumber} — ${timeBlock.charAt(0) + timeBlock.slice(1).toLowerCase()}`,
    body,
  };
}

export function getMissedDayMessage(): { title: string; body: string } {
  const body =
    MISSED_DAY_MESSAGES[
      Math.floor(Math.random() * MISSED_DAY_MESSAGES.length)
    ];
  return { title: "Welcome back!", body };
}

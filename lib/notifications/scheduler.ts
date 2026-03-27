import type { TimeBlock } from "@/lib/types";

// Time block offsets in hours from wake time
const TIME_BLOCK_OFFSETS: Record<string, number> = {
  MORNING: 0,
  MIDDAY: 6,
  AFTERNOON: 9,
  EVENING: 12,
};

export function getTimeBlockForUser(
  wakeUpTime: string,
  timezone: string
): TimeBlock | null {
  const [wakeHour, wakeMin] = wakeUpTime.split(":").map(Number);

  const now = new Date();
  const userTime = new Date(
    now.toLocaleString("en-US", { timeZone: timezone })
  );
  const currentMinutes = userTime.getHours() * 60 + userTime.getMinutes();
  const wakeMinutes = wakeHour * 60 + wakeMin;

  const blocks: TimeBlock[] = ["MORNING", "MIDDAY", "AFTERNOON", "EVENING"];

  for (let i = blocks.length - 1; i >= 0; i--) {
    const blockStart =
      wakeMinutes + TIME_BLOCK_OFFSETS[blocks[i]] * 60;
    if (currentMinutes >= blockStart && currentMinutes < blockStart + 15) {
      return blocks[i];
    }
  }

  return null;
}

export function shouldSendReminder(
  wakeUpTime: string,
  timezone: string
): { shouldSend: boolean; timeBlock: TimeBlock | null } {
  const timeBlock = getTimeBlockForUser(wakeUpTime, timezone);
  return { shouldSend: timeBlock !== null, timeBlock };
}

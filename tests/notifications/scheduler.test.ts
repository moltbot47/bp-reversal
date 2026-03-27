import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getTimeBlockForUser,
  shouldSendReminder,
} from "@/lib/notifications/scheduler";

describe("getTimeBlockForUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns MORNING at wake time", () => {
    // Mock the current time to be exactly 06:00 CST
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T11:00:00Z")); // 06:00 CST

    const result = getTimeBlockForUser("06:00", "America/Chicago");
    expect(result).toBe("MORNING");
    vi.useRealTimers();
  });

  it("returns null outside of any time block window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T15:30:00Z")); // 10:30 CST — between blocks
    const result = getTimeBlockForUser("06:00", "America/Chicago");
    expect(result).toBeNull();
    vi.useRealTimers();
  });

  it("returns MIDDAY at wake + 6 hours", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T17:00:00Z")); // 12:00 CST
    const result = getTimeBlockForUser("06:00", "America/Chicago");
    expect(result).toBe("MIDDAY");
    vi.useRealTimers();
  });

  it("returns AFTERNOON at wake + 9 hours", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T20:00:00Z")); // 15:00 CST
    const result = getTimeBlockForUser("06:00", "America/Chicago");
    expect(result).toBe("AFTERNOON");
    vi.useRealTimers();
  });

  it("returns EVENING at wake + 12 hours", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T23:00:00Z")); // 18:00 CST
    const result = getTimeBlockForUser("06:00", "America/Chicago");
    expect(result).toBe("EVENING");
    vi.useRealTimers();
  });

  it("adjusts for different wake times", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z")); // 07:00 CST
    const result = getTimeBlockForUser("07:00", "America/Chicago");
    expect(result).toBe("MORNING");
    vi.useRealTimers();
  });
});

describe("shouldSendReminder", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns shouldSend=true with timeBlock when in a window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T11:00:00Z")); // 06:00 CST
    const result = shouldSendReminder("06:00", "America/Chicago");
    expect(result.shouldSend).toBe(true);
    expect(result.timeBlock).toBe("MORNING");
    vi.useRealTimers();
  });

  it("returns shouldSend=false when not in a window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T15:30:00Z")); // 10:30 CST
    const result = shouldSendReminder("06:00", "America/Chicago");
    expect(result.shouldSend).toBe(false);
    expect(result.timeBlock).toBeNull();
    vi.useRealTimers();
  });
});

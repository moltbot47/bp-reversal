import { describe, it, expect } from "vitest";
import {
  getNotificationMessage,
  getMissedDayMessage,
} from "@/lib/notifications/templates";

describe("getNotificationMessage", () => {
  const timeBlocks = ["MORNING", "MIDDAY", "AFTERNOON", "EVENING"] as const;

  timeBlocks.forEach((tb) => {
    it(`returns title and body for ${tb}`, () => {
      const msg = getNotificationMessage(tb, 5);
      expect(msg.title).toContain("Day 5");
      expect(msg.title).toContain(tb.charAt(0) + tb.slice(1).toLowerCase());
      expect(msg.body).toBeTruthy();
      expect(msg.body.length).toBeGreaterThan(10);
    });
  });

  it("never includes guilt-tripping language", () => {
    const guiltyWords = ["shame", "lazy", "fail", "disappoint", "should have"];
    for (let i = 0; i < 50; i++) {
      const tb = timeBlocks[i % 4];
      const msg = getNotificationMessage(tb, i + 1);
      guiltyWords.forEach((word) => {
        expect(msg.body.toLowerCase()).not.toContain(word);
        expect(msg.title.toLowerCase()).not.toContain(word);
      });
    }
  });

  it("includes day number in title", () => {
    const msg = getNotificationMessage("MORNING", 42);
    expect(msg.title).toContain("42");
  });
});

describe("getMissedDayMessage", () => {
  it("returns encouraging title and body", () => {
    const msg = getMissedDayMessage();
    expect(msg.title).toBeTruthy();
    expect(msg.body).toBeTruthy();
  });

  it("never guilt-trips", () => {
    const guiltyWords = ["shame", "lazy", "fail", "disappoint"];
    for (let i = 0; i < 20; i++) {
      const msg = getMissedDayMessage();
      guiltyWords.forEach((word) => {
        expect(msg.body.toLowerCase()).not.toContain(word);
      });
    }
  });
});

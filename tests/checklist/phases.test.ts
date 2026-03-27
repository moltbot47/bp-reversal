import { describe, it, expect } from "vitest";
import {
  getCurrentPhase,
  getDayNumber,
  getUnlockedItems,
  getItemsWithStatus,
  getPhaseLabel,
  getPhaseDescription,
} from "@/lib/checklist/phases";

describe("getCurrentPhase", () => {
  it("returns 1 when no start date", () => {
    expect(getCurrentPhase(null)).toBe(1);
  });

  it("returns 1 for day 1", () => {
    expect(getCurrentPhase(new Date())).toBe(1);
  });

  it("returns 1 for day 30", () => {
    const start = new Date();
    start.setDate(start.getDate() - 29);
    expect(getCurrentPhase(start)).toBe(1);
  });

  it("returns 2 for day 31", () => {
    const start = new Date();
    start.setDate(start.getDate() - 31);
    expect(getCurrentPhase(start)).toBe(2);
  });

  it("returns 2 for day 60", () => {
    const start = new Date();
    start.setDate(start.getDate() - 60);
    expect(getCurrentPhase(start)).toBe(2);
  });

  it("returns 3 for day 61", () => {
    const start = new Date();
    start.setDate(start.getDate() - 61);
    expect(getCurrentPhase(start)).toBe(3);
  });

  it("returns 3 for day 90", () => {
    const start = new Date();
    start.setDate(start.getDate() - 90);
    expect(getCurrentPhase(start)).toBe(3);
  });

  it("returns 3 for day 120 (past 90)", () => {
    const start = new Date();
    start.setDate(start.getDate() - 120);
    expect(getCurrentPhase(start)).toBe(3);
  });
});

describe("getDayNumber", () => {
  it("returns 1 when no start date", () => {
    expect(getDayNumber(null)).toBe(1);
  });

  it("returns 1 on start day", () => {
    expect(getDayNumber(new Date())).toBe(1);
  });

  it("returns correct day number", () => {
    const start = new Date();
    start.setDate(start.getDate() - 9);
    expect(getDayNumber(start)).toBe(10);
  });

  it("never returns less than 1", () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    expect(getDayNumber(future)).toBeGreaterThanOrEqual(1);
  });
});

describe("getUnlockedItems", () => {
  it("returns 12 items for phase 1", () => {
    expect(getUnlockedItems(null)).toHaveLength(12);
  });

  it("returns 18 items for phase 2", () => {
    const start = new Date();
    start.setDate(start.getDate() - 40);
    expect(getUnlockedItems(start)).toHaveLength(18);
  });

  it("returns 21 items for phase 3", () => {
    const start = new Date();
    start.setDate(start.getDate() - 70);
    expect(getUnlockedItems(start)).toHaveLength(21);
  });
});

describe("getItemsWithStatus", () => {
  it("marks items as not completed when no completions", () => {
    const items = getItemsWithStatus(null, new Set());
    const unlocked = items.filter((i) => !i.locked);
    unlocked.forEach((item) => {
      expect(item.completed).toBe(false);
    });
  });

  it("marks completed items correctly", () => {
    const completed = new Set(["morning-bp-check", "morning-breathing"]);
    const items = getItemsWithStatus(null, completed);
    expect(items.find((i) => i.slug === "morning-bp-check")?.completed).toBe(true);
    expect(items.find((i) => i.slug === "morning-breathing")?.completed).toBe(true);
    expect(items.find((i) => i.slug === "morning-water")?.completed).toBe(false);
  });

  it("locks phase 2 items when in phase 1", () => {
    const items = getItemsWithStatus(null, new Set());
    const p2items = items.filter((i) => i.phase === 2);
    p2items.forEach((item) => {
      expect(item.locked).toBe(true);
    });
  });

  it("unlocks phase 2 items when in phase 2", () => {
    const start = new Date();
    start.setDate(start.getDate() - 40);
    const items = getItemsWithStatus(start, new Set());
    const p2items = items.filter((i) => i.phase === 2);
    p2items.forEach((item) => {
      expect(item.locked).toBe(false);
    });
  });

  it("always returns 21 items total", () => {
    const items = getItemsWithStatus(null, new Set());
    expect(items).toHaveLength(21);
  });
});

describe("getPhaseLabel", () => {
  it("returns correct labels", () => {
    expect(getPhaseLabel(1)).toBe("Phase 1 — Foundation");
    expect(getPhaseLabel(2)).toBe("Phase 2 — Amplification");
    expect(getPhaseLabel(3)).toBe("Phase 3 — Optimization");
  });
});

describe("getPhaseDescription", () => {
  it("returns non-empty descriptions for phases 1-3", () => {
    expect(getPhaseDescription(1)).toContain("Days 1-30");
    expect(getPhaseDescription(2)).toContain("Days 31-60");
    expect(getPhaseDescription(3)).toContain("Days 61-90");
  });
});

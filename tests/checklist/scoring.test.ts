import { describe, it, expect } from "vitest";
import { calculateDailyProgress, calculatePillarStats } from "@/lib/checklist/scoring";
import type { ChecklistItemWithStatus } from "@/lib/types";

function makeItem(
  overrides: Partial<ChecklistItemWithStatus>
): ChecklistItemWithStatus {
  return {
    slug: "test",
    title: "Test",
    description: null,
    pillar: "VASCULAR",
    timeBlock: "MORNING",
    phase: 1,
    sortOrder: 1,
    completed: false,
    locked: false,
    ...overrides,
  };
}

describe("calculateDailyProgress", () => {
  it("returns 0 for empty items", () => {
    expect(calculateDailyProgress([])).toBe(0);
  });

  it("returns 0 when nothing completed", () => {
    const items = [makeItem({}), makeItem({ slug: "b" })];
    expect(calculateDailyProgress(items)).toBe(0);
  });

  it("returns 100 when all completed", () => {
    const items = [
      makeItem({ completed: true }),
      makeItem({ slug: "b", completed: true }),
    ];
    expect(calculateDailyProgress(items)).toBe(100);
  });

  it("returns 50 when half completed", () => {
    const items = [
      makeItem({ completed: true }),
      makeItem({ slug: "b", completed: false }),
    ];
    expect(calculateDailyProgress(items)).toBe(50);
  });

  it("excludes locked items from calculation", () => {
    const items = [
      makeItem({ completed: true }),
      makeItem({ slug: "b", locked: true }),
    ];
    expect(calculateDailyProgress(items)).toBe(100);
  });

  it("returns 0 when all items are locked", () => {
    const items = [
      makeItem({ locked: true }),
      makeItem({ slug: "b", locked: true }),
    ];
    expect(calculateDailyProgress(items)).toBe(0);
  });

  it("rounds to integer", () => {
    const items = [
      makeItem({ completed: true }),
      makeItem({ slug: "b" }),
      makeItem({ slug: "c" }),
    ];
    expect(calculateDailyProgress(items)).toBe(33);
  });
});

describe("calculatePillarStats", () => {
  it("returns stats for all 4 pillars", () => {
    const items = [
      makeItem({ pillar: "VASCULAR", completed: true }),
      makeItem({ slug: "n", pillar: "NERVOUS" }),
      makeItem({ slug: "b", pillar: "BLOOD" }),
      makeItem({ slug: "k", pillar: "KIDNEY" }),
    ];
    const stats = calculatePillarStats(items);
    expect(stats).toHaveLength(4);
    expect(stats.map((s) => s.pillar)).toEqual([
      "VASCULAR",
      "NERVOUS",
      "BLOOD",
      "KIDNEY",
    ]);
  });

  it("calculates correct today percent", () => {
    const items = [
      makeItem({ pillar: "VASCULAR", completed: true }),
      makeItem({ slug: "v2", pillar: "VASCULAR", completed: false }),
    ];
    const stats = calculatePillarStats(items);
    const vascular = stats.find((s) => s.pillar === "VASCULAR")!;
    expect(vascular.todayPercent).toBe(50);
    expect(vascular.todayCompleted).toBe(1);
    expect(vascular.todayTotal).toBe(2);
  });

  it("excludes locked items", () => {
    const items = [
      makeItem({ pillar: "VASCULAR", completed: true }),
      makeItem({ slug: "v2", pillar: "VASCULAR", locked: true }),
    ];
    const stats = calculatePillarStats(items);
    const vascular = stats.find((s) => s.pillar === "VASCULAR")!;
    expect(vascular.todayPercent).toBe(100);
    expect(vascular.todayTotal).toBe(1);
  });

  it("includes correct labels and colors", () => {
    const stats = calculatePillarStats([]);
    expect(stats[0].label).toBe("Vascular");
    expect(stats[0].color).toBe("#EF4444");
    expect(stats[1].label).toBe("Nervous");
    expect(stats[1].color).toBe("#3B82F6");
    expect(stats[2].label).toBe("Blood");
    expect(stats[2].color).toBe("#22C55E");
    expect(stats[3].label).toBe("Kidney");
    expect(stats[3].color).toBe("#A855F7");
  });

  it("calculates weekly average with completions map", () => {
    const items = [
      makeItem({ slug: "v1", pillar: "VASCULAR" }),
      makeItem({ slug: "v2", pillar: "VASCULAR" }),
    ];
    const weekly = new Map<string, Set<string>>();
    weekly.set("2024-01-01", new Set(["v1", "v2"])); // 100%
    weekly.set("2024-01-02", new Set(["v1"])); // 50%
    weekly.set("2024-01-03", new Set([])); // 0%

    const stats = calculatePillarStats(items, weekly);
    const vascular = stats.find((s) => s.pillar === "VASCULAR")!;
    expect(vascular.weeklyAverage).toBe(50); // (100+50+0)/3
  });
});

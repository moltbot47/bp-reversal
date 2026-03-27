import { describe, it, expect } from "vitest";
import {
  BP_MILESTONES,
  checkMilestones,
  getBPCategory,
  getBPTrend,
} from "@/lib/bp/milestones";

describe("BP_MILESTONES", () => {
  it("has 3 milestones", () => {
    expect(BP_MILESTONES).toHaveLength(3);
  });

  it("milestones are in descending order of severity", () => {
    expect(BP_MILESTONES[0].systolic).toBe(140);
    expect(BP_MILESTONES[1].systolic).toBe(130);
    expect(BP_MILESTONES[2].systolic).toBe(120);
  });

  it("all milestones have required fields", () => {
    BP_MILESTONES.forEach((m) => {
      expect(m.key).toBeTruthy();
      expect(m.label).toBeTruthy();
      expect(m.message).toBeTruthy();
      expect(m.systolic).toBeGreaterThan(0);
      expect(m.diastolic).toBeGreaterThan(0);
    });
  });
});

describe("checkMilestones", () => {
  it("returns no milestones for high BP", () => {
    const result = checkMilestones(160, 100, new Set());
    expect(result).toHaveLength(0);
  });

  it("returns below-140-90 milestone", () => {
    const result = checkMilestones(135, 85, new Set());
    expect(result.some((m) => m.key === "below-140-90")).toBe(true);
  });

  it("returns multiple milestones when BP is very low", () => {
    const result = checkMilestones(115, 75, new Set());
    expect(result).toHaveLength(3);
  });

  it("skips already achieved milestones", () => {
    const achieved = new Set(["below-140-90"]);
    const result = checkMilestones(125, 75, achieved);
    expect(result.some((m) => m.key === "below-140-90")).toBe(false);
    expect(result.some((m) => m.key === "below-130-80")).toBe(true);
  });

  it("returns empty when all milestones achieved", () => {
    const achieved = new Set(["below-140-90", "below-130-80", "below-120-80"]);
    const result = checkMilestones(115, 75, achieved);
    expect(result).toHaveLength(0);
  });

  it("checks both systolic and diastolic", () => {
    // Systolic below 140 but diastolic above 90
    const result = checkMilestones(135, 95, new Set());
    expect(result.some((m) => m.key === "below-140-90")).toBe(false);
  });
});

describe("getBPCategory", () => {
  it("returns Normal for <120/<80", () => {
    const cat = getBPCategory(115, 75);
    expect(cat.label).toBe("Normal");
    expect(cat.color).toBe("#22C55E");
  });

  it("returns Elevated for 120-129/<80", () => {
    const cat = getBPCategory(125, 75);
    expect(cat.label).toBe("Elevated");
  });

  it("returns Stage 1 for 130-139 or 80-89", () => {
    expect(getBPCategory(135, 85).label).toBe("Stage 1");
    expect(getBPCategory(125, 85).label).toBe("Stage 1");
  });

  it("returns Stage 2 for >=140 or >=90", () => {
    expect(getBPCategory(145, 95).label).toBe("Stage 2");
    expect(getBPCategory(150, 100).label).toBe("Stage 2");
  });

  it("boundary: exactly 120/80 is Elevated", () => {
    expect(getBPCategory(120, 75).label).toBe("Elevated");
  });

  it("boundary: exactly 130/80 is Stage 1", () => {
    expect(getBPCategory(130, 80).label).toBe("Stage 1");
  });
});

describe("getBPTrend", () => {
  it("returns stable for fewer than 2 entries", () => {
    expect(getBPTrend([])).toBe("stable");
    expect(getBPTrend([{ systolic: 140, diastolic: 90 }])).toBe("stable");
  });

  it("returns down when BP is decreasing", () => {
    const entries = [
      { systolic: 150, diastolic: 95 },
      { systolic: 148, diastolic: 93 },
      { systolic: 145, diastolic: 90 },
      { systolic: 140, diastolic: 88 },
      { systolic: 135, diastolic: 85 },
      { systolic: 130, diastolic: 82 },
    ];
    expect(getBPTrend(entries)).toBe("down");
  });

  it("returns up when BP is increasing", () => {
    const entries = [
      { systolic: 120, diastolic: 80 },
      { systolic: 122, diastolic: 82 },
      { systolic: 125, diastolic: 83 },
      { systolic: 130, diastolic: 85 },
      { systolic: 135, diastolic: 88 },
      { systolic: 140, diastolic: 90 },
    ];
    expect(getBPTrend(entries)).toBe("up");
  });

  it("returns stable when BP is flat", () => {
    const entries = [
      { systolic: 130, diastolic: 85 },
      { systolic: 131, diastolic: 85 },
      { systolic: 130, diastolic: 86 },
      { systolic: 130, diastolic: 85 },
      { systolic: 131, diastolic: 85 },
      { systolic: 130, diastolic: 86 },
    ];
    expect(getBPTrend(entries)).toBe("stable");
  });
});

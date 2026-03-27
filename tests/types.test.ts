import { describe, it, expect } from "vitest";
import {
  PILLAR_COLORS,
  PILLAR_LABELS,
  TIMEBLOCK_LABELS,
  TIMEBLOCK_RANGES,
} from "@/lib/types";

describe("PILLAR_COLORS", () => {
  it("has all 4 pillars", () => {
    expect(PILLAR_COLORS.VASCULAR).toBe("#EF4444");
    expect(PILLAR_COLORS.NERVOUS).toBe("#3B82F6");
    expect(PILLAR_COLORS.BLOOD).toBe("#22C55E");
    expect(PILLAR_COLORS.KIDNEY).toBe("#A855F7");
  });
});

describe("PILLAR_LABELS", () => {
  it("has human-readable labels", () => {
    expect(PILLAR_LABELS.VASCULAR).toBe("Vascular");
    expect(PILLAR_LABELS.NERVOUS).toBe("Nervous");
    expect(PILLAR_LABELS.BLOOD).toBe("Blood");
    expect(PILLAR_LABELS.KIDNEY).toBe("Kidney");
  });
});

describe("TIMEBLOCK_LABELS", () => {
  it("has all 4 time blocks", () => {
    expect(TIMEBLOCK_LABELS.MORNING).toBe("Morning");
    expect(TIMEBLOCK_LABELS.MIDDAY).toBe("Midday");
    expect(TIMEBLOCK_LABELS.AFTERNOON).toBe("Afternoon");
    expect(TIMEBLOCK_LABELS.EVENING).toBe("Evening");
  });
});

describe("TIMEBLOCK_RANGES", () => {
  it("has time ranges", () => {
    expect(TIMEBLOCK_RANGES.MORNING).toContain("AM");
    expect(TIMEBLOCK_RANGES.MIDDAY).toContain("PM");
    expect(TIMEBLOCK_RANGES.AFTERNOON).toContain("PM");
    expect(TIMEBLOCK_RANGES.EVENING).toContain("PM");
  });
});

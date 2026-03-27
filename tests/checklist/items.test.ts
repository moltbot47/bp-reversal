import { describe, it, expect } from "vitest";
import { CHECKLIST_ITEMS } from "@/lib/checklist/items";

describe("CHECKLIST_ITEMS", () => {
  it("has exactly 21 items", () => {
    expect(CHECKLIST_ITEMS).toHaveLength(21);
  });

  it("has 12 Phase 1 items", () => {
    const p1 = CHECKLIST_ITEMS.filter((i) => i.phase === 1);
    expect(p1).toHaveLength(12);
  });

  it("has 6 Phase 2 items", () => {
    const p2 = CHECKLIST_ITEMS.filter((i) => i.phase === 2);
    expect(p2).toHaveLength(6);
  });

  it("has 3 Phase 3 items", () => {
    const p3 = CHECKLIST_ITEMS.filter((i) => i.phase === 3);
    expect(p3).toHaveLength(3);
  });

  it("has unique slugs", () => {
    const slugs = CHECKLIST_ITEMS.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique sortOrders", () => {
    const orders = CHECKLIST_ITEMS.map((i) => i.sortOrder);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("has items sorted by sortOrder", () => {
    for (let i = 1; i < CHECKLIST_ITEMS.length; i++) {
      expect(CHECKLIST_ITEMS[i].sortOrder).toBeGreaterThan(
        CHECKLIST_ITEMS[i - 1].sortOrder
      );
    }
  });

  it("covers all 4 time blocks", () => {
    const blocks = new Set(CHECKLIST_ITEMS.map((i) => i.timeBlock));
    expect(blocks).toContain("MORNING");
    expect(blocks).toContain("MIDDAY");
    expect(blocks).toContain("AFTERNOON");
    expect(blocks).toContain("EVENING");
  });

  it("covers all 4 pillars", () => {
    const pillars = new Set(
      CHECKLIST_ITEMS.filter((i) => i.pillar).map((i) => i.pillar)
    );
    expect(pillars).toContain("VASCULAR");
    expect(pillars).toContain("NERVOUS");
    expect(pillars).toContain("BLOOD");
    expect(pillars).toContain("KIDNEY");
  });

  it("contains research-backed items", () => {
    const titles = CHECKLIST_ITEMS.map((i) => i.title.toLowerCase());
    expect(titles.some((t) => t.includes("garlic"))).toBe(true);
    expect(titles.some((t) => t.includes("hibiscus"))).toBe(true);
    expect(titles.some((t) => t.includes("citrulline"))).toBe(true);
    expect(titles.some((t) => t.includes("4-7-8"))).toBe(true);
    expect(titles.some((t) => t.includes("magnesium"))).toBe(true);
    expect(titles.some((t) => t.includes("ashwagandha"))).toBe(true);
    expect(titles.some((t) => t.includes("dandelion"))).toBe(true);
    expect(titles.some((t) => t.includes("beetroot"))).toBe(true);
  });

  it("has BP check items without a pillar", () => {
    const bpItems = CHECKLIST_ITEMS.filter((i) =>
      i.slug.includes("bp-check")
    );
    expect(bpItems.length).toBe(2);
    bpItems.forEach((item) => {
      expect(item.pillar).toBeNull();
    });
  });

  it("all items have title and timeBlock", () => {
    CHECKLIST_ITEMS.forEach((item) => {
      expect(item.title).toBeTruthy();
      expect(item.timeBlock).toBeTruthy();
      expect(item.slug).toBeTruthy();
    });
  });
});

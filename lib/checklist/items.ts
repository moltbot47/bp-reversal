import type { ChecklistItemDef } from "@/lib/types";

export const CHECKLIST_ITEMS: ChecklistItemDef[] = [
  // Phase 1 — Foundation (Days 1-30): 12 items
  // Morning
  { slug: "morning-bp-check", title: "Check blood pressure — log it", description: "Same arm, same time, seated 5 min before reading", pillar: null, timeBlock: "MORNING", phase: 1, sortOrder: 1 },
  { slug: "morning-breathing", title: "4-7-8 Breathing — 5 minutes", description: "4s inhale, 7s hold, 8s exhale. 5-8 cycles", pillar: "NERVOUS", timeBlock: "MORNING", phase: 1, sortOrder: 2 },
  { slug: "morning-water", title: "20 oz water with electrolytes", description: "Pinch of pink Himalayan salt + electrolyte drops", pillar: "BLOOD", timeBlock: "MORNING", phase: 1, sortOrder: 3 },
  { slug: "morning-supplements", title: "Supplements: K2 (180mcg) + D3 (5,000 IU) + Omega-3", description: "Take with healthy fat for absorption", pillar: "VASCULAR", timeBlock: "MORNING", phase: 1, sortOrder: 4 },
  { slug: "morning-garlic", title: "Raw garlic: 2-3 cloves, crushed", description: "Crush, wait 10 min to activate allicin", pillar: "VASCULAR", timeBlock: "MORNING", phase: 1, sortOrder: 5 },
  { slug: "morning-hibiscus-1", title: "Hibiscus tea — Cup #1", description: "Brew strong. 1-2 tea bags", pillar: "KIDNEY", timeBlock: "MORNING", phase: 1, sortOrder: 6 },
  // Midday
  { slug: "midday-potassium-meal", title: "Potassium-rich meal", description: "Spinach, avocado, sweet potato. Target 1,500+ mg", pillar: "BLOOD", timeBlock: "MIDDAY", phase: 1, sortOrder: 7 },
  { slug: "midday-hibiscus-2", title: "Hibiscus tea — Cup #2", description: "Maintain steady intake throughout the day", pillar: "KIDNEY", timeBlock: "MIDDAY", phase: 1, sortOrder: 8 },
  { slug: "midday-hydration", title: "Continue hydrating — electrolyte water", description: "Track total oz. Goal: half body weight in ounces", pillar: "BLOOD", timeBlock: "MIDDAY", phase: 1, sortOrder: 9 },
  // Afternoon
  { slug: "afternoon-dandelion", title: "Dandelion root tea", description: "Natural diuretic. Supports kidney sodium clearance", pillar: "KIDNEY", timeBlock: "AFTERNOON", phase: 1, sortOrder: 10 },
  // Evening
  { slug: "evening-hibiscus-3", title: "Hibiscus tea — Cup #3", description: "Final cup of the day for sustained kidney support", pillar: "KIDNEY", timeBlock: "EVENING", phase: 1, sortOrder: 11 },
  { slug: "evening-bp-check", title: "Check blood pressure — log it (PM)", description: "Compare to morning reading", pillar: null, timeBlock: "EVENING", phase: 1, sortOrder: 12 },

  // Phase 2 — Amplification (Days 31-60): +6 items
  { slug: "morning-citrulline", title: "L-Citrulline 3-6g", description: "Empty stomach for best absorption. Boosts nitric oxide", pillar: "VASCULAR", timeBlock: "MORNING", phase: 2, sortOrder: 13 },
  { slug: "morning-ashwagandha", title: "Ashwagandha 600mg KSM-66", description: "Cortisol regulation. Take with breakfast", pillar: "NERVOUS", timeBlock: "MORNING", phase: 2, sortOrder: 14 },
  { slug: "morning-sunlight", title: "20-30 min sunlight", description: "Arms and face exposed. Releases stored nitric oxide", pillar: "VASCULAR", timeBlock: "MORNING", phase: 2, sortOrder: 15 },
  { slug: "midday-beetroot", title: "Beetroot or beet juice", description: "Alternative nitric oxide pathway via nitrate-nitrite-NO", pillar: "VASCULAR", timeBlock: "MIDDAY", phase: 2, sortOrder: 16 },
  { slug: "evening-magnesium", title: "Magnesium Glycinate 400-600mg", description: "Natural calcium channel blocker. Relaxes muscles, improves sleep", pillar: "VASCULAR", timeBlock: "EVENING", phase: 2, sortOrder: 17 },
  { slug: "evening-cold-exposure", title: "Cold exposure: 30-60 sec cold shower", description: "Focus on chest and face. Vagal nerve activation", pillar: "NERVOUS", timeBlock: "EVENING", phase: 2, sortOrder: 18 },

  // Phase 3 — Optimization (Days 61-90): +3 items
  { slug: "afternoon-walk", title: "30-minute walk (moderate pace)", description: "Preferably outdoors on grass (grounding effect)", pillar: "NERVOUS", timeBlock: "AFTERNOON", phase: 3, sortOrder: 19 },
  { slug: "evening-breathing", title: "4-7-8 Breathing — 5 min before bed", description: "Prepares body for nocturnal BP dip", pillar: "NERVOUS", timeBlock: "EVENING", phase: 3, sortOrder: 20 },
  { slug: "evening-sleep", title: "Sleep by 10:00 PM", description: "Kidneys perform sodium clearance during deep sleep", pillar: "NERVOUS", timeBlock: "EVENING", phase: 3, sortOrder: 21 },
] as ChecklistItemDef[];

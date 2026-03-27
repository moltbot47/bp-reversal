import "dotenv/config";
import { PrismaClient, Pillar, TimeBlock } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const checklistItems = [
  // === Phase 1 — Foundation (Days 1-30): 12 items ===

  // Morning (6-8 AM)
  {
    slug: "morning-bp-check",
    title: "Check blood pressure — log it",
    description: "Same arm, same time, seated 5 min before reading",
    pillar: null,
    timeBlock: TimeBlock.MORNING,
    phase: 1,
    sortOrder: 1,
  },
  {
    slug: "morning-breathing",
    title: "4-7-8 Breathing — 5 minutes",
    description: "4s inhale, 7s hold, 8s exhale. 5-8 cycles",
    pillar: Pillar.NERVOUS,
    timeBlock: TimeBlock.MORNING,
    phase: 1,
    sortOrder: 2,
  },
  {
    slug: "morning-water",
    title: "20 oz water with electrolytes",
    description: "Pinch of pink Himalayan salt + electrolyte drops",
    pillar: Pillar.BLOOD,
    timeBlock: TimeBlock.MORNING,
    phase: 1,
    sortOrder: 3,
  },
  {
    slug: "morning-supplements",
    title: "Supplements: K2 (180mcg) + D3 (5,000 IU) + Omega-3",
    description: "Take with healthy fat for absorption",
    pillar: Pillar.VASCULAR,
    timeBlock: TimeBlock.MORNING,
    phase: 1,
    sortOrder: 4,
  },
  {
    slug: "morning-garlic",
    title: "Raw garlic: 2-3 cloves, crushed",
    description: "Crush, wait 10 min to activate allicin",
    pillar: Pillar.VASCULAR,
    timeBlock: TimeBlock.MORNING,
    phase: 1,
    sortOrder: 5,
  },
  {
    slug: "morning-hibiscus-1",
    title: "Hibiscus tea — Cup #1",
    description: "Brew strong. 1-2 tea bags",
    pillar: Pillar.KIDNEY,
    timeBlock: TimeBlock.MORNING,
    phase: 1,
    sortOrder: 6,
  },

  // Midday (12-2 PM)
  {
    slug: "midday-potassium-meal",
    title: "Potassium-rich meal",
    description: "Spinach, avocado, sweet potato. Target 1,500+ mg",
    pillar: Pillar.BLOOD,
    timeBlock: TimeBlock.MIDDAY,
    phase: 1,
    sortOrder: 7,
  },
  {
    slug: "midday-hibiscus-2",
    title: "Hibiscus tea — Cup #2",
    description: "Maintain steady intake throughout the day",
    pillar: Pillar.KIDNEY,
    timeBlock: TimeBlock.MIDDAY,
    phase: 1,
    sortOrder: 8,
  },
  {
    slug: "midday-hydration",
    title: "Continue hydrating — electrolyte water",
    description: "Track total oz. Goal: half body weight in ounces",
    pillar: Pillar.BLOOD,
    timeBlock: TimeBlock.MIDDAY,
    phase: 1,
    sortOrder: 9,
  },

  // Afternoon (3-5 PM)
  {
    slug: "afternoon-dandelion",
    title: "Dandelion root tea",
    description: "Natural diuretic. Supports kidney sodium clearance",
    pillar: Pillar.KIDNEY,
    timeBlock: TimeBlock.AFTERNOON,
    phase: 1,
    sortOrder: 10,
  },

  // Evening (6-9 PM)
  {
    slug: "evening-hibiscus-3",
    title: "Hibiscus tea — Cup #3",
    description: "Final cup of the day for sustained kidney support",
    pillar: Pillar.KIDNEY,
    timeBlock: TimeBlock.EVENING,
    phase: 1,
    sortOrder: 11,
  },
  {
    slug: "evening-bp-check",
    title: "Check blood pressure — log it (PM)",
    description: "Compare to morning reading",
    pillar: null,
    timeBlock: TimeBlock.EVENING,
    phase: 1,
    sortOrder: 12,
  },

  // === Phase 2 — Amplification (Days 31-60): +6 items ===

  // Morning
  {
    slug: "morning-citrulline",
    title: "L-Citrulline 3-6g",
    description: "Empty stomach for best absorption. Boosts nitric oxide",
    pillar: Pillar.VASCULAR,
    timeBlock: TimeBlock.MORNING,
    phase: 2,
    sortOrder: 13,
  },
  {
    slug: "morning-ashwagandha",
    title: "Ashwagandha 600mg KSM-66",
    description: "Cortisol regulation. Take with breakfast",
    pillar: Pillar.NERVOUS,
    timeBlock: TimeBlock.MORNING,
    phase: 2,
    sortOrder: 14,
  },
  {
    slug: "morning-sunlight",
    title: "20-30 min sunlight",
    description: "Arms and face exposed. Releases stored nitric oxide",
    pillar: Pillar.VASCULAR,
    timeBlock: TimeBlock.MORNING,
    phase: 2,
    sortOrder: 15,
  },

  // Midday
  {
    slug: "midday-beetroot",
    title: "Beetroot or beet juice",
    description: "Alternative nitric oxide pathway via nitrate-nitrite-NO",
    pillar: Pillar.VASCULAR,
    timeBlock: TimeBlock.MIDDAY,
    phase: 2,
    sortOrder: 16,
  },

  // Evening
  {
    slug: "evening-magnesium",
    title: "Magnesium Glycinate 400-600mg",
    description: "Natural calcium channel blocker. Relaxes muscles, improves sleep",
    pillar: Pillar.VASCULAR,
    timeBlock: TimeBlock.EVENING,
    phase: 2,
    sortOrder: 17,
  },
  {
    slug: "evening-cold-exposure",
    title: "Cold exposure: 30-60 sec cold shower",
    description: "Focus on chest and face. Vagal nerve activation",
    pillar: Pillar.NERVOUS,
    timeBlock: TimeBlock.EVENING,
    phase: 2,
    sortOrder: 18,
  },

  // === Phase 3 — Optimization (Days 61-90): +3 items ===

  // Afternoon
  {
    slug: "afternoon-walk",
    title: "30-minute walk (moderate pace)",
    description: "Preferably outdoors on grass (grounding effect)",
    pillar: Pillar.NERVOUS,
    timeBlock: TimeBlock.AFTERNOON,
    phase: 3,
    sortOrder: 19,
  },

  // Evening
  {
    slug: "evening-breathing",
    title: "4-7-8 Breathing — 5 min before bed",
    description: "Prepares body for nocturnal BP dip",
    pillar: Pillar.NERVOUS,
    timeBlock: TimeBlock.EVENING,
    phase: 3,
    sortOrder: 20,
  },
  {
    slug: "evening-sleep",
    title: "Sleep by 10:00 PM",
    description: "Kidneys perform sodium clearance during deep sleep",
    pillar: Pillar.NERVOUS,
    timeBlock: TimeBlock.EVENING,
    phase: 3,
    sortOrder: 21,
  },
];

async function main() {
  console.log("Seeding checklist items...");

  for (const item of checklistItems) {
    await prisma.checklistItem.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        description: item.description,
        pillar: item.pillar,
        timeBlock: item.timeBlock,
        phase: item.phase,
        sortOrder: item.sortOrder,
      },
      create: {
        slug: item.slug,
        title: item.title,
        description: item.description,
        pillar: item.pillar,
        timeBlock: item.timeBlock,
        phase: item.phase,
        sortOrder: item.sortOrder,
      },
    });
  }

  console.log(`Seeded ${checklistItems.length} checklist items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

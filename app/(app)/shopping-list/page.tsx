"use client";

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { PILLAR_COLORS } from "@/lib/types";

interface ShopItem {
  name: string;
  detail: string;
  pillar: string;
  phase: number;
  category: string;
}

const SHOP_ITEMS: ShopItem[] = [
  // Supplements
  { name: "Vitamin K2 (MK-7) — 180mcg", detail: "For arterial decalcification. Take with fat.", pillar: "VASCULAR", phase: 1, category: "Supplements" },
  { name: "Vitamin D3 — 5,000 IU", detail: "Supports calcium metabolism with K2.", pillar: "VASCULAR", phase: 1, category: "Supplements" },
  { name: "Omega-3 Fish Oil — 2g EPA/DHA", detail: "Anti-inflammatory, supports endothelial function.", pillar: "VASCULAR", phase: 1, category: "Supplements" },
  { name: "L-Citrulline — 3-6g powder", detail: "Nitric oxide precursor. Phase 2.", pillar: "VASCULAR", phase: 2, category: "Supplements" },
  { name: "Ashwagandha KSM-66 — 600mg", detail: "Cortisol regulation. Phase 2.", pillar: "NERVOUS", phase: 2, category: "Supplements" },
  { name: "Magnesium Glycinate — 400-600mg", detail: "Natural calcium channel blocker. Phase 2.", pillar: "VASCULAR", phase: 2, category: "Supplements" },

  // Teas & Drinks
  { name: "Hibiscus tea bags (bulk)", detail: "3 cups/day. ACE-inhibitor effect. Get organic.", pillar: "KIDNEY", phase: 1, category: "Teas & Drinks" },
  { name: "Dandelion root tea", detail: "Natural diuretic for sodium clearance.", pillar: "KIDNEY", phase: 1, category: "Teas & Drinks" },
  { name: "Beetroot juice (or powder)", detail: "Alternative NO pathway. Phase 2.", pillar: "VASCULAR", phase: 2, category: "Teas & Drinks" },

  // Fresh Foods
  { name: "Raw garlic (fresh bulbs)", detail: "2-3 cloves daily. Crush and wait 10 min for allicin.", pillar: "VASCULAR", phase: 1, category: "Fresh Foods" },
  { name: "Spinach (fresh or frozen)", detail: "High potassium. For midday meals.", pillar: "BLOOD", phase: 1, category: "Fresh Foods" },
  { name: "Avocados", detail: "Potassium-rich. ~500mg per avocado.", pillar: "BLOOD", phase: 1, category: "Fresh Foods" },
  { name: "Sweet potatoes", detail: "High potassium, complex carbs.", pillar: "BLOOD", phase: 1, category: "Fresh Foods" },
  { name: "Bananas", detail: "Quick potassium source. Easy snack.", pillar: "BLOOD", phase: 1, category: "Fresh Foods" },

  // Hydration
  { name: "Pink Himalayan salt", detail: "Pinch in morning water for electrolytes.", pillar: "BLOOD", phase: 1, category: "Hydration" },
  { name: "Electrolyte drops (no sugar)", detail: "Add to water throughout the day.", pillar: "BLOOD", phase: 1, category: "Hydration" },

  // Equipment
  { name: "Blood pressure monitor (upper arm)", detail: "Validated automatic cuff. Not wrist type.", pillar: "", phase: 1, category: "Equipment" },
];

const CATEGORIES = ["Supplements", "Teas & Drinks", "Fresh Foods", "Hydration", "Equipment"];

export default function ShoppingListPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (name: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const totalItems = SHOP_ITEMS.length;
  const checkedCount = checked.size;

  return (
    <div>
      <Header
        title="Shopping List"
        subtitle={`${checkedCount}/${totalItems} items checked`}
        action={
          <div className="flex items-center gap-2 text-sm text-[#667085]">
            <ShoppingCart className="w-4 h-4" />
          </div>
        }
      />

      <div className="px-4 py-2 space-y-4">
        {/* Phase notice */}
        <Card padding="sm">
          <p className="text-xs text-[#667085] text-center">
            Items marked <Badge label="Phase 2" color="#3B82F6" small /> are
            added on Day 31. Start with Phase 1 items first.
          </p>
        </Card>

        {CATEGORIES.map((category) => {
          const items = SHOP_ITEMS.filter((i) => i.category === category);
          if (items.length === 0) return null;

          return (
            <Card key={category} padding="md">
              <h3 className="text-sm font-semibold text-[#1D2939] mb-3">
                {category}
              </h3>
              <div className="space-y-1">
                {items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => toggle(item.name)}
                    className="flex items-start gap-3 w-full text-left py-2 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`w-6 h-6 flex-shrink-0 rounded-md flex items-center justify-center mt-0.5 transition-colors ${
                        checked.has(item.name)
                          ? "bg-green-500"
                          : "border-2 border-gray-200 bg-white"
                      }`}
                    >
                      {checked.has(item.name) && (
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-medium ${
                            checked.has(item.name)
                              ? "text-gray-400 line-through"
                              : "text-[#1D2939]"
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.phase > 1 && (
                          <Badge
                            label={`Phase ${item.phase}`}
                            color="#3B82F6"
                            small
                          />
                        )}
                        {item.pillar && (
                          <Badge
                            label={item.pillar.charAt(0) + item.pillar.slice(1).toLowerCase()}
                            color={PILLAR_COLORS[item.pillar]}
                            small
                          />
                        )}
                      </div>
                      <p className="text-xs text-[#667085] mt-0.5">
                        {item.detail}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          );
        })}

        {/* Disclaimer */}
        <p className="text-xs text-[#667085] text-center px-4 pb-4">
          These items are based on the research protocol. Always consult your
          doctor before starting new supplements, especially if on medication.
        </p>
      </div>
    </div>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Heart } from "lucide-react";
import { CHECKLIST_ITEMS } from "@/lib/checklist/items";
import { PILLAR_COLORS, PILLAR_LABELS } from "@/lib/types";

interface DayData {
  date: string;
  dayNumber: number;
  phase: number;
  completed: string[];
  totalUnlocked: number;
  percent: number;
  bpAm: { systolic: number; diastolic: number } | null;
  bpPm: { systolic: number; diastolic: number } | null;
}

interface DayDetailProps {
  day: DayData;
}

export function DayDetail({ day }: DayDetailProps) {
  const dateObj = new Date(day.date + "T12:00:00");
  const dateLabel = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const phaseLabel =
    day.phase === 1
      ? "Foundation"
      : day.phase === 2
      ? "Amplification"
      : "Optimization";

  const completedSet = new Set(day.completed);
  const unlockedItems = CHECKLIST_ITEMS.filter((i) => i.phase <= day.phase);

  // Group by time block
  const timeBlocks = ["MORNING", "MIDDAY", "AFTERNOON", "EVENING"] as const;
  const timeBlockLabels: Record<string, string> = {
    MORNING: "Morning",
    MIDDAY: "Midday",
    AFTERNOON: "Afternoon",
    EVENING: "Evening",
  };

  return (
    <Card padding="md">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold text-[#1D2939]">{dateLabel}</h3>
          <p className="text-xs text-[#667085]">
            Day {day.dayNumber} &middot; Phase {day.phase} ({phaseLabel})
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#1D2939]">{day.percent}%</p>
          <p className="text-[10px] text-[#667085]">
            {day.completed.length}/{day.totalUnlocked} items
          </p>
        </div>
      </div>

      {/* BP readings */}
      {(day.bpAm || day.bpPm) && (
        <div className="flex gap-2 my-3">
          {day.bpAm && (
            <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1.5 rounded-lg text-xs">
              <Heart className="w-3 h-3 text-red-400" />
              <span className="font-semibold text-[#1D2939]">
                {day.bpAm.systolic}/{day.bpAm.diastolic}
              </span>
              <span className="text-[#667085]">AM</span>
            </div>
          )}
          {day.bpPm && (
            <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1.5 rounded-lg text-xs">
              <Heart className="w-3 h-3 text-blue-400" />
              <span className="font-semibold text-[#1D2939]">
                {day.bpPm.systolic}/{day.bpPm.diastolic}
              </span>
              <span className="text-[#667085]">PM</span>
            </div>
          )}
        </div>
      )}

      {/* Item breakdown by time block */}
      <div className="space-y-3 mt-3">
        {timeBlocks.map((tb) => {
          const items = unlockedItems.filter((i) => i.timeBlock === tb);
          if (items.length === 0) return null;

          const tbCompleted = items.filter((i) => completedSet.has(i.slug)).length;

          return (
            <div key={tb}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-[#667085]">
                  {timeBlockLabels[tb]}
                </p>
                <p className="text-[10px] text-[#667085]">
                  {tbCompleted}/{items.length}
                </p>
              </div>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const done = completedSet.has(item.slug);
                  return (
                    <div
                      key={item.slug}
                      className={`flex items-center gap-2 py-1 px-2 rounded text-xs ${
                        done ? "bg-green-50" : "bg-gray-50"
                      }`}
                    >
                      {done ? (
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                      )}
                      <span
                        className={`flex-1 ${
                          done ? "text-[#1D2939]" : "text-gray-400"
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.pillar && (
                        <Badge
                          label={PILLAR_LABELS[item.pillar]}
                          color={PILLAR_COLORS[item.pillar]}
                          small
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

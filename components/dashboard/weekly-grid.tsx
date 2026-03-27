"use client";

import { Card } from "@/components/ui/card";

interface WeeklyGridProps {
  data: { date: string; percent: number }[];
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getColor(percent: number): string {
  if (percent === 0) return "#F3F4F6";
  if (percent < 33) return "#FEE2E2";
  if (percent < 66) return "#FEF3C7";
  if (percent < 90) return "#D1FAE5";
  return "#22C55E";
}

export function WeeklyGrid({ data }: WeeklyGridProps) {
  const last7 = data.slice(-7);
  while (last7.length < 7) {
    last7.unshift({ date: "", percent: 0 });
  }

  return (
    <Card padding="md">
      <p className="text-sm font-semibold text-[#1D2939] mb-3">
        This week
      </p>
      <div className="grid grid-cols-7 gap-1.5">
        {last7.map((day, i) => (
          <div key={i} className="text-center">
            <p className="text-[10px] text-[#667085] mb-1">
              {DAY_LABELS[i]}
            </p>
            <div
              className="w-full aspect-square rounded-md transition-colors"
              style={{ backgroundColor: getColor(day.percent) }}
              title={`${day.date}: ${day.percent}%`}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

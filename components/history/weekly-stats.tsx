"use client";

import { Card } from "@/components/ui/card";

interface WeekData {
  weekNumber: number;
  startDate: string;
  endDate: string;
  avgPercent: number;
  daysActive: number;
  totalDays: number;
}

interface WeeklyStatsProps {
  weeks: WeekData[];
}

function formatShortDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function WeeklyStats({ weeks }: WeeklyStatsProps) {
  if (weeks.length === 0) return null;

  return (
    <Card padding="md">
      <h3 className="text-sm font-semibold text-[#1D2939] mb-3">
        Weekly Breakdown
      </h3>
      <div className="space-y-2">
        {weeks.map((week) => (
          <div key={week.weekNumber} className="flex items-center gap-3">
            <div className="w-16 flex-shrink-0">
              <p className="text-xs font-semibold text-[#1D2939]">
                Week {week.weekNumber}
              </p>
              <p className="text-[10px] text-[#667085]">
                {formatShortDate(week.startDate)}
              </p>
            </div>

            {/* Bar */}
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${week.avgPercent}%`,
                  backgroundColor:
                    week.avgPercent >= 80
                      ? "#22C55E"
                      : week.avgPercent >= 50
                      ? "#EAB308"
                      : week.avgPercent > 0
                      ? "#F97316"
                      : "#E5E7EB",
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-[#1D2939]">
                {week.avgPercent}%
              </span>
            </div>

            <div className="w-12 text-right flex-shrink-0">
              <p className="text-[10px] text-[#667085]">
                {week.daysActive}/{week.totalDays} days
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

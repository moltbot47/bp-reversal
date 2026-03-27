"use client";

import { Card } from "@/components/ui/card";
import type { PillarStats } from "@/lib/types";

interface PillarCardProps {
  stats: PillarStats;
}

export function PillarCard({ stats }: PillarCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: stats.color }}
        />
        <span className="text-sm font-semibold text-[#1D2939]">
          {stats.label}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-[#1D2939]">
            {stats.todayPercent}%
          </p>
          <p className="text-xs text-[#667085]">today</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-[#667085]">
            {stats.weeklyAverage}%
          </p>
          <p className="text-xs text-[#667085]">7-day avg</p>
        </div>
      </div>
      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${stats.todayPercent}%`,
            backgroundColor: stats.color,
          }}
        />
      </div>
    </Card>
  );
}

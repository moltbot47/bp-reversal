"use client";

import { Card } from "@/components/ui/card";
import { Flame, Target, Calendar, Trophy } from "lucide-react";

interface ProtocolStatsProps {
  dayNumber: number;
  phase: number;
  streak: { current: number; longest: number };
  stats: {
    totalDaysTracked: number;
    daysActive: number;
    avgPercent: number;
    perfectDays: number;
  };
}

export function ProtocolStats({
  dayNumber,
  phase,
  streak,
  stats,
}: ProtocolStatsProps) {
  const phaseLabel =
    phase === 1
      ? "Foundation"
      : phase === 2
      ? "Amplification"
      : "Optimization";

  const progressPercent = Math.min(100, Math.round((dayNumber / 90) * 100));

  return (
    <div className="space-y-3">
      {/* Protocol progress bar */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[#1D2939]">
            Protocol Progress
          </h3>
          <span className="text-xs font-medium text-[#667085]">
            Day {dayNumber} of 90
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
          {/* Phase markers */}
          <div
            className="absolute top-0 bottom-0 border-r-2 border-white z-10"
            style={{ left: "33.3%" }}
          />
          <div
            className="absolute top-0 bottom-0 border-r-2 border-white z-10"
            style={{ left: "66.6%" }}
          />
          {/* Progress fill */}
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, #F59E0B 0%, #F59E0B 33%, #3B82F6 33%, #3B82F6 66%, #22C55E 66%, #22C55E 100%)`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-[#667085]">
          <span>Phase 1</span>
          <span>Phase 2</span>
          <span>Phase 3</span>
        </div>
        <p className="text-xs text-[#EB9D2A] font-medium mt-2 text-center">
          Currently in Phase {phase} — {phaseLabel}
        </p>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-2">
        <Card padding="sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1D2939]">{streak.current}</p>
              <p className="text-[10px] text-[#667085]">Day streak</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1D2939]">{stats.avgPercent}%</p>
              <p className="text-[10px] text-[#667085]">Avg adherence</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1D2939]">
                {stats.daysActive}/{stats.totalDaysTracked}
              </p>
              <p className="text-[10px] text-[#667085]">Days active</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1D2939]">{stats.perfectDays}</p>
              <p className="text-[10px] text-[#667085]">Perfect days</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { ProgressRing } from "@/components/ui/progress-ring";
import { PillarCard } from "@/components/dashboard/pillar-card";
import { StreakCounter } from "@/components/dashboard/streak-counter";
import { WeeklyGrid } from "@/components/dashboard/weekly-grid";
import type { DashboardData } from "@/lib/types";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[#EB9D2A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" subtitle="Your 4-pillar progress" />

      {/* Overall adherence */}
      <div className="flex flex-col items-center py-4">
        <ProgressRing
          percent={data.overallPercent}
          size={100}
          strokeWidth={8}
          color={data.overallPercent >= 80 ? "#22C55E" : "#EB9D2A"}
        >
          <div className="text-center">
            <p className="text-xl font-bold text-[#1D2939]">
              {data.overallPercent}%
            </p>
          </div>
        </ProgressRing>
        <p className="text-sm text-[#667085] mt-2">Overall adherence today</p>
      </div>

      <div className="px-4 space-y-3">
        {/* Pillar Cards */}
        <div className="grid grid-cols-2 gap-3">
          {data.pillars.map((stats) => (
            <PillarCard key={stats.pillar} stats={stats} />
          ))}
        </div>

        {/* Streak */}
        <StreakCounter
          current={data.streak.current}
          longest={data.streak.longest}
        />

        {/* Weekly Grid */}
        <WeeklyGrid data={data.weeklyGrid} />
      </div>
    </div>
  );
}

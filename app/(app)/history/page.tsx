"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { CalendarHeatmap } from "@/components/history/calendar-heatmap";
import { DayDetail } from "@/components/history/day-detail";
import { WeeklyStats } from "@/components/history/weekly-stats";
import { ProtocolStats } from "@/components/history/protocol-stats";

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

interface WeekData {
  weekNumber: number;
  startDate: string;
  endDate: string;
  avgPercent: number;
  daysActive: number;
  totalDays: number;
}

interface HistoryData {
  days: DayData[];
  weeks: WeekData[];
  monthlyStats: {
    totalDaysTracked: number;
    daysActive: number;
    avgPercent: number;
    perfectDays: number;
  };
  dayNumber: number;
  phase: number;
  streak: { current: number; longest: number };
}

export default function HistoryPage() {
  const [data, setData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((d) => {
        setData(d);
        // Auto-select today or the most recent day
        if (d.days.length > 0) {
          const today = new Date().toISOString().split("T")[0];
          const todayData = d.days.find((day: DayData) => day.date === today);
          setSelectedDay(todayData || d.days[d.days.length - 1]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[#EB9D2A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || data.days.length === 0) {
    return (
      <div>
        <Header title="History" subtitle="Your protocol journey" />
        <div className="px-4 py-8 text-center">
          <p className="text-[#667085]">
            Complete your first day to start tracking
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="History" subtitle="Your protocol journey" />

      <div className="px-4 space-y-3 py-2">
        {/* Protocol progress + stat cards */}
        <ProtocolStats
          dayNumber={data.dayNumber}
          phase={data.phase}
          streak={data.streak}
          stats={data.monthlyStats}
        />

        {/* Calendar heatmap */}
        <CalendarHeatmap
          days={data.days}
          onSelectDay={setSelectedDay}
          selectedDate={selectedDay?.date || null}
        />

        {/* Day detail */}
        {selectedDay && <DayDetail day={selectedDay} />}

        {/* Weekly breakdown */}
        <WeeklyStats weeks={data.weeks} />
      </div>
    </div>
  );
}

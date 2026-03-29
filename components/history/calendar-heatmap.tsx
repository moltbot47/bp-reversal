"use client";

import { Card } from "@/components/ui/card";

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

interface CalendarHeatmapProps {
  days: DayData[];
  onSelectDay: (day: DayData) => void;
  selectedDate: string | null;
}

function getHeatColor(percent: number): string {
  if (percent === 0) return "#F3F4F6";
  if (percent < 25) return "#FEE2E2";
  if (percent < 50) return "#FED7AA";
  if (percent < 75) return "#D1FAE5";
  if (percent < 100) return "#86EFAC";
  return "#22C55E";
}

function getPhaseColor(phase: number): string {
  if (phase === 1) return "#F59E0B";
  if (phase === 2) return "#3B82F6";
  return "#22C55E";
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function CalendarHeatmap({ days, onSelectDay, selectedDate }: CalendarHeatmapProps) {
  if (days.length === 0) {
    return (
      <Card padding="lg">
        <p className="text-sm text-[#667085] text-center py-4">
          Start your protocol to see your calendar
        </p>
      </Card>
    );
  }

  // Build calendar grid — start from the first day's weekday
  const firstDate = new Date(days[0].date + "T12:00:00");
  const startDow = firstDate.getDay(); // 0=Sun

  // Pad the beginning with empty cells
  const cells: (DayData | null)[] = [];
  for (let i = 0; i < startDow; i++) {
    cells.push(null);
  }
  for (const day of days) {
    cells.push(day);
  }

  // Fill to complete the last week
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  // Split into weeks (rows)
  const weeks: (DayData | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // Find phase transition days
  const phaseMarkers = new Set<string>();
  for (let i = 1; i < days.length; i++) {
    if (days[i].phase !== days[i - 1].phase) {
      phaseMarkers.add(days[i].date);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#1D2939]">
          90-Day Protocol Calendar
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-[#667085]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#F3F4F6", border: "1px solid #E5E7EB" }} />
            0%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#D1FAE5" }} />
            50%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#22C55E" }} />
            100%
          </span>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i} className="text-center text-[10px] text-[#667085] font-medium">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => {
              if (!day) {
                return <div key={di} className="aspect-square" />;
              }

              const isToday = day.date === today;
              const isSelected = day.date === selectedDate;
              const isPhaseStart = phaseMarkers.has(day.date);

              return (
                <button
                  key={di}
                  onClick={() => onSelectDay(day)}
                  className={`aspect-square rounded-md relative transition-all ${
                    isSelected
                      ? "ring-2 ring-[#EB9D2A] ring-offset-1"
                      : isToday
                      ? "ring-2 ring-[#1D2939] ring-offset-1"
                      : ""
                  }`}
                  style={{ backgroundColor: getHeatColor(day.percent) }}
                  title={`Day ${day.dayNumber}: ${day.percent}% (${day.completed.length}/${day.totalUnlocked})`}
                >
                  {/* Day number */}
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-gray-600 opacity-60">
                    {day.dayNumber}
                  </span>

                  {/* Phase transition marker */}
                  {isPhaseStart && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white"
                      style={{ backgroundColor: getPhaseColor(day.phase) }}
                    />
                  )}

                  {/* BP logged indicator */}
                  {(day.bpAm || day.bpPm) && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Phase legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-[#667085]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F59E0B" }} />
          Phase 1
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#3B82F6" }} />
          Phase 2
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22C55E" }} />
          Phase 3
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-400" />
          BP logged
        </span>
      </div>
    </Card>
  );
}

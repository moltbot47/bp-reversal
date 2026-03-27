"use client";

import { useEffect } from "react";
import { useChecklistStore } from "@/stores/checklist-store";
import { Header } from "@/components/layout/header";
import { ProgressRing } from "@/components/ui/progress-ring";
import { TimeBlockCard } from "@/components/checklist/time-block";
import { getPhaseLabel } from "@/lib/checklist/phases";

export default function TodayPage() {
  const {
    items,
    loading,
    dayNumber,
    phase,
    setItems,
    setDayInfo,
    toggleItem,
    getTimeBlockGroups,
    getDailyProgress,
  } = useChecklistStore();

  useEffect(() => {
    fetch("/api/checklist")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items);
        setDayInfo(data.dayNumber, data.phase);
      });
  }, [setItems, setDayInfo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[#EB9D2A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const progress = getDailyProgress();
  const groups = getTimeBlockGroups();
  const completedCount = items.filter((i) => i.completed && !i.locked).length;
  const totalCount = items.filter((i) => !i.locked).length;

  return (
    <div>
      <Header
        title={`Day ${dayNumber}`}
        subtitle={getPhaseLabel(phase)}
      />

      {/* Progress Ring */}
      <div className="flex flex-col items-center py-4">
        <ProgressRing
          percent={progress}
          size={100}
          strokeWidth={8}
          color={progress === 100 ? "#22C55E" : "#EB9D2A"}
        >
          <div className="text-center">
            <p className="text-xl font-bold text-[#1D2939]">{progress}%</p>
          </div>
        </ProgressRing>
        <p className="text-sm text-[#667085] mt-2">
          {completedCount} of {totalCount} completed
        </p>
        {progress === 100 && (
          <p className="text-sm font-medium text-green-600 mt-1">
            All done for today!
          </p>
        )}
      </div>

      {/* Time Blocks */}
      <div className="px-4 space-y-1">
        {groups.map((group) => (
          <TimeBlockCard
            key={group.timeBlock}
            group={group}
            onToggle={toggleItem}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { getBPCategory, getBPTrend } from "@/lib/bp/milestones";
import type { BPEntryData } from "@/lib/types";

interface BPSummaryProps {
  entries: BPEntryData[];
}

export function BPSummary({ entries }: BPSummaryProps) {
  if (entries.length === 0) return null;

  const latest = entries[0];
  const category = getBPCategory(latest.systolic, latest.diastolic);
  const trend = getBPTrend(entries);

  const TrendIcon =
    trend === "down"
      ? TrendingDown
      : trend === "up"
      ? TrendingUp
      : Minus;

  const trendColor =
    trend === "down"
      ? "text-green-500"
      : trend === "up"
      ? "text-red-500"
      : "text-gray-400";

  return (
    <Card padding="md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#667085] mb-1">Latest Reading</p>
          <p className="text-3xl font-bold text-[#1D2939]">
            {latest.systolic}/{latest.diastolic}
          </p>
          {latest.pulse && (
            <p className="text-sm text-[#667085]">{latest.pulse} bpm</p>
          )}
        </div>
        <div className="text-right">
          <span
            className="inline-block text-xs font-medium px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${category.color}15`,
              color: category.color,
            }}
          >
            {category.label}
          </span>
          <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-xs font-medium">
              {trend === "down"
                ? "Improving"
                : trend === "up"
                ? "Rising"
                : "Stable"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

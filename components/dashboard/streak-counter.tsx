"use client";

import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  current: number;
  longest: number;
}

export function StreakCounter({ current, longest }: StreakCounterProps) {
  return (
    <Card padding="md">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <Flame className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <p className="text-2xl font-bold text-[#1D2939]">
            {current} day{current !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-[#667085]">
            Current streak &middot; Best: {longest}
          </p>
        </div>
      </div>
    </Card>
  );
}

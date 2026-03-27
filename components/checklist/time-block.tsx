"use client";

import { Sun, CloudSun, Sunset, Moon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ChecklistItemRow } from "./checklist-item";
import type { TimeBlockGroup } from "@/lib/types";

const ICONS: Record<string, React.ReactNode> = {
  MORNING: <Sun className="w-5 h-5 text-amber-500" />,
  MIDDAY: <CloudSun className="w-5 h-5 text-blue-500" />,
  AFTERNOON: <Sunset className="w-5 h-5 text-orange-500" />,
  EVENING: <Moon className="w-5 h-5 text-indigo-500" />,
};

interface TimeBlockProps {
  group: TimeBlockGroup;
  onToggle: (slug: string) => void;
}

export function TimeBlockCard({ group, onToggle }: TimeBlockProps) {
  const completedCount = group.items.filter(
    (i) => i.completed && !i.locked
  ).length;
  const totalCount = group.items.filter((i) => !i.locked).length;

  if (group.items.length === 0) return null;

  return (
    <Card padding="sm" className="mb-3">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          {ICONS[group.timeBlock]}
          <div>
            <h3 className="text-sm font-semibold text-[#1D2939]">
              {group.label}
            </h3>
            <p className="text-xs text-[#667085]">{group.timeRange}</p>
          </div>
        </div>
        <span className="text-xs font-medium text-[#667085]">
          {completedCount}/{totalCount}
        </span>
      </div>
      <div className="divide-y divide-gray-50">
        {group.items.map((item) => (
          <ChecklistItemRow
            key={item.slug}
            item={item}
            onToggle={onToggle}
          />
        ))}
      </div>
    </Card>
  );
}

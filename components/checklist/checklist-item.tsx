"use client";

import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PILLAR_COLORS, PILLAR_LABELS } from "@/lib/types";
import type { ChecklistItemWithStatus } from "@/lib/types";

interface ChecklistItemProps {
  item: ChecklistItemWithStatus;
  onToggle: (slug: string) => void;
}

export function ChecklistItemRow({ item, onToggle }: ChecklistItemProps) {
  if (item.locked) {
    return (
      <div className="flex items-start gap-3 py-3 px-3 rounded-lg opacity-50">
        <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
          <Lock className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-400 line-through">
            {item.title}
          </p>
          {item.description && (
            <p className="text-xs text-gray-300 mt-0.5">{item.description}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => onToggle(item.slug)}
      className="flex items-start gap-3 py-3 px-3 rounded-lg w-full text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
    >
      <motion.div
        className={`w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors ${
          item.completed
            ? "bg-green-500"
            : "bg-white border-2 border-gray-200"
        }`}
        whileTap={{ scale: 0.9 }}
        animate={item.completed ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        {item.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`text-sm font-medium ${
              item.completed
                ? "text-gray-400 line-through"
                : "text-[#1D2939]"
            }`}
          >
            {item.title}
          </p>
        </div>
        {item.description && (
          <p className="text-xs text-[#667085] mt-0.5">{item.description}</p>
        )}
        {item.pillar && (
          <div className="mt-1">
            <Badge
              label={PILLAR_LABELS[item.pillar]}
              color={PILLAR_COLORS[item.pillar]}
              small
            />
          </div>
        )}
      </div>
    </button>
  );
}

import { CHECKLIST_ITEMS } from "./items";
import type { ChecklistItemDef, ChecklistItemWithStatus } from "@/lib/types";

export function getCurrentPhase(protocolStartDate: Date | null): number {
  if (!protocolStartDate) return 1;
  const now = new Date();
  const diffMs = now.getTime() - protocolStartDate.getTime();
  const dayNumber = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  if (dayNumber <= 30) return 1;
  if (dayNumber <= 60) return 2;
  return 3;
}

export function getDayNumber(protocolStartDate: Date | null): number {
  if (!protocolStartDate) return 1;
  const now = new Date();
  const diffMs = now.getTime() - protocolStartDate.getTime();
  return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
}

export function getUnlockedItems(
  protocolStartDate: Date | null
): ChecklistItemDef[] {
  const phase = getCurrentPhase(protocolStartDate);
  return CHECKLIST_ITEMS.filter((item) => item.phase <= phase);
}

export function getItemsWithStatus(
  protocolStartDate: Date | null,
  completedSlugs: Set<string>
): ChecklistItemWithStatus[] {
  const phase = getCurrentPhase(protocolStartDate);

  return CHECKLIST_ITEMS.map((item) => ({
    ...item,
    completed: completedSlugs.has(item.slug),
    locked: item.phase > phase,
  }));
}

export function getPhaseLabel(phase: number): string {
  switch (phase) {
    case 1:
      return "Phase 1 — Foundation";
    case 2:
      return "Phase 2 — Amplification";
    case 3:
      return "Phase 3 — Optimization";
    default:
      return `Phase ${phase}`;
  }
}

export function getPhaseDescription(phase: number): string {
  switch (phase) {
    case 1:
      return "Days 1-30: Build the foundation with core habits";
    case 2:
      return "Days 31-60: Amplify results with advanced supplements";
    case 3:
      return "Days 61-90: Optimize with lifestyle changes";
    default:
      return "";
  }
}

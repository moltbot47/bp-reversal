"use client";

import { useEffect, useState } from "react";
import { useBPStore } from "@/stores/bp-store";
import { useToastStore } from "@/components/ui/toast-provider";
import { Header } from "@/components/layout/header";
import { BPEntryForm } from "@/components/bp/bp-entry-form";
import { BPTrendChart } from "@/components/bp/bp-trend-chart";
import { BPSummary } from "@/components/bp/bp-summary";
import type { BPPeriod } from "@/lib/types";

export default function BPLogPage() {
  const { entries, loading, setEntries, addEntry } = useBPStore();
  const { addToast } = useToastStore();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/bp-log")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => setEntries(data.entries))
      .catch(() => setEntries([]));
  }, [setEntries]);

  const handleSubmit = async (entry: {
    systolic: number;
    diastolic: number;
    pulse?: number;
    period: BPPeriod;
    notes?: string;
  }) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/bp-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error("Failed to log reading");
      const data = await res.json();

      addEntry({
        ...data.entry,
        createdAt: data.entry.createdAt,
      });

      // Show milestone toasts
      if (data.newMilestones?.length > 0) {
        for (const m of data.newMilestones) {
          addToast({
            title: "Milestone reached!",
            description: m.message,
            variant: "celebration",
          });
        }
      } else {
        addToast({ title: "Reading logged", variant: "success" });
      }
    } catch {
      addToast({ title: "Failed to save. Try again.", variant: "default" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[#EB9D2A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Blood Pressure"
        subtitle="Track your readings over time"
      />

      <div className="px-4 space-y-3 py-2">
        <BPSummary entries={entries} />
        <BPEntryForm onSubmit={handleSubmit} loading={submitting} />
        <BPTrendChart entries={entries} />
      </div>
    </div>
  );
}

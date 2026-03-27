"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BPPeriod } from "@/lib/types";

interface BPEntryFormProps {
  onSubmit: (entry: {
    systolic: number;
    diastolic: number;
    pulse?: number;
    period: BPPeriod;
    notes?: string;
  }) => void;
  loading?: boolean;
}

export function BPEntryForm({ onSubmit, loading }: BPEntryFormProps) {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [period, setPeriod] = useState<BPPeriod>("AM");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!systolic || !diastolic) return;
    onSubmit({
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      pulse: pulse ? parseInt(pulse) : undefined,
      period,
      notes: notes || undefined,
    });
    setSystolic("");
    setDiastolic("");
    setPulse("");
    setNotes("");
  };

  return (
    <Card padding="lg">
      <h3 className="text-sm font-semibold text-[#1D2939] mb-4">
        Log Reading
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#667085] mb-1">
              Systolic (top)
            </label>
            <input
              type="number"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              placeholder="120"
              min={60}
              max={250}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[#1D2939] text-center text-lg font-semibold placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EB9D2A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#667085] mb-1">
              Diastolic (bottom)
            </label>
            <input
              type="number"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              placeholder="80"
              min={40}
              max={150}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[#1D2939] text-center text-lg font-semibold placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EB9D2A]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#667085] mb-1">
              Pulse (optional)
            </label>
            <input
              type="number"
              value={pulse}
              onChange={(e) => setPulse(e.target.value)}
              placeholder="72"
              min={30}
              max={200}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[#1D2939] text-center placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EB9D2A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#667085] mb-1">
              Time of day
            </label>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {(["AM", "PM"] as BPPeriod[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    period === p
                      ? "bg-[#EB9D2A] text-white"
                      : "bg-white text-[#667085] hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#667085] mb-1">
            Notes (optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="After breakfast, feeling calm..."
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-[#1D2939] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EB9D2A]"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading || !systolic || !diastolic}>
          {loading ? "Saving..." : "Log Reading"}
        </Button>
      </form>
    </Card>
  );
}

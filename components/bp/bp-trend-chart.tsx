"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { BPEntryData } from "@/lib/types";

interface BPTrendChartProps {
  entries: BPEntryData[];
}

export function BPTrendChart({ entries }: BPTrendChartProps) {
  const chartData = [...entries]
    .reverse()
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      systolic: e.systolic,
      diastolic: e.diastolic,
    }));

  if (chartData.length === 0) {
    return (
      <Card padding="lg">
        <p className="text-sm text-[#667085] text-center py-8">
          Log your first reading to see trends
        </p>
      </Card>
    );
  }

  return (
    <Card padding="md">
      <h3 className="text-sm font-semibold text-[#1D2939] mb-3">
        BP Trend
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#667085" }}
              tickLine={false}
            />
            <YAxis
              domain={[50, 200]}
              tick={{ fontSize: 10, fill: "#667085" }}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FDFDF8",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
              }}
            />
            <ReferenceLine
              y={120}
              stroke="#22C55E"
              strokeDasharray="3 3"
              label={{ value: "120", position: "right", fontSize: 10 }}
            />
            <ReferenceLine
              y={140}
              stroke="#EF4444"
              strokeDasharray="3 3"
              label={{ value: "140", position: "right", fontSize: 10 }}
            />
            <Line
              type="monotone"
              dataKey="systolic"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Systolic"
            />
            <Line
              type="monotone"
              dataKey="diastolic"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Diastolic"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

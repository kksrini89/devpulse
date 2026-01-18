"use client";

/**
 * Activity Chart (Client Component)
 *
 * Displays a line/area chart of daily activity.
 * Uses Recharts for rendering.
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { formatChartDate } from "@/lib/utils";
import type { DailyStats } from "@/types";

interface ActivityChartProps {
  data: DailyStats[];
  title?: string;
}

export function ActivityChart({
  data,
  title = "Activity Over Time",
}: ActivityChartProps) {
  // Transform data for the chart
  const chartData = data.map((d) => ({
    ...d,
    dateLabel: formatChartDate(d.date),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                stroke="#9ca3af"
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 16 }}
                iconType="circle"
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="commits"
                name="Commits"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCommits)"
              />
              <Area
                type="monotone"
                dataKey="hoursLogged"
                name="Hours"
                stroke="#22c55e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHours)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

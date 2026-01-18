"use client";

/**
 * Project Breakdown Chart (Client Component)
 *
 * Displays a horizontal bar chart showing commit distribution by project.
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { ProjectBreakdown as ProjectBreakdownType } from "@/types";

interface ProjectBreakdownProps {
  data: ProjectBreakdownType[];
}

export function ProjectBreakdown({ data }: ProjectBreakdownProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity by Project</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No project data available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity by Project</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="projectName"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={120}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as ProjectBreakdownType;
                  return (
                    <div className="rounded-lg border bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.projectName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatNumber(item.commits)} commits ({formatPercent(item.percentage)})
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="commits" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.projectColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-2">
          {data.slice(0, 5).map((project) => (
            <div
              key={project.projectId}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: project.projectColor }}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {project.projectName}
                </span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">
                {formatPercent(project.percentage)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

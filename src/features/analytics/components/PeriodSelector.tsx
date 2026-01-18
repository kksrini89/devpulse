"use client";

/**
 * Period Selector (Client Component)
 *
 * Allows user to select a time period for analytics.
 * Uses URL search params for state (shareable, back-button friendly).
 */

import { useRouter, useSearchParams } from "next/navigation";
import { TIME_PERIODS, type TimePeriod } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PeriodSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = (searchParams.get("period") as TimePeriod) || "30d";

  const handlePeriodChange = (period: TimePeriod) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", period);
    router.push(`/analytics?${params.toString()}`);
  };

  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
      {Object.entries(TIME_PERIODS).map(([key, config]) => (
        <button
          key={key}
          onClick={() => handlePeriodChange(key as TimePeriod)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
            currentPeriod === key
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          )}
        >
          {config.label}
        </button>
      ))}
    </div>
  );
}

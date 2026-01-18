import { Card, CardContent } from "@/components/ui";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatTrend } from "@/lib/utils";

/**
 * Metric Card (Server Component)
 *
 * Displays a single metric with an optional trend indicator.
 */

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
}: MetricCardProps) {
  const hasTrend = trend !== undefined && trend !== 0;
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          {icon && (
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              {icon}
            </div>
          )}
          {hasTrend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositive && "text-green-600 dark:text-green-400",
                isNegative && "text-red-600 dark:text-red-400"
              )}
            >
              {isPositive && <TrendingUp className="h-4 w-4" />}
              {isNegative && <TrendingDown className="h-4 w-4" />}
              {!isPositive && !isNegative && <Minus className="h-4 w-4" />}
              {formatTrend(trend)}
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

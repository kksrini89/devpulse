import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { Skeleton, Card, CardContent, CardHeader } from "@/components/ui";
import {
  PeriodSelector,
  ActivityChart,
  MetricCard,
  ProjectBreakdown,
} from "@/features/analytics/components";
import {
  getDailyStats,
  getPeriodSummary,
  getProjectBreakdown,
} from "@/features/analytics/queries";
import { TIME_PERIODS, type TimePeriod } from "@/lib/constants";
import { formatNumber, formatDuration, formatDate } from "@/lib/utils";
import { GitCommit, Clock, Calendar, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics",
  description: "View your development activity and productivity metrics",
};

/**
 * Analytics Page (Server Component)
 *
 * Displays charts and metrics for developer activity.
 * Uses URL search params for period selection.
 */

interface Props {
  searchParams: Promise<{ period?: string }>;
}

export default async function AnalyticsPage({ searchParams }: Props) {
  const params = await searchParams;
  const period = (params.period as TimePeriod) || "30d";
  const periodConfig = TIME_PERIODS[period] || TIME_PERIODS["30d"];

  // Parallel data fetching
  const [dailyStats, summary, projectBreakdown] = await Promise.all([
    getDailyStats(period),
    getPeriodSummary(period),
    getProjectBreakdown(),
  ]);

  return (
    <>
      <Header
        title="Analytics"
        description={`Activity overview for ${periodConfig.label.toLowerCase()}`}
        actions={
          <Suspense fallback={<Skeleton className="h-10 w-64" />}>
            <PeriodSelector />
          </Suspense>
        }
      />

      {/* Metric Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Commits"
          value={formatNumber(summary.totalCommits)}
          subtitle={`${summary.avgCommitsPerDay} per day avg`}
          trend={summary.commitsTrend}
          icon={<GitCommit className="h-5 w-5" />}
        />
        <MetricCard
          title="Hours Logged"
          value={formatDuration(summary.totalHours)}
          subtitle={`${summary.avgHoursPerDay}h per day avg`}
          trend={summary.hoursTrend}
          icon={<Clock className="h-5 w-5" />}
        />
        <MetricCard
          title="Code Reviews"
          value={formatNumber(summary.totalReviews)}
          subtitle="Pull requests reviewed"
          icon={<Calendar className="h-5 w-5" />}
        />
        <MetricCard
          title="Deployments"
          value={formatNumber(summary.totalDeploys)}
          subtitle="Production releases"
          icon={<Rocket className="h-5 w-5" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Chart - takes 2 columns */}
        <div className="lg:col-span-2">
          <ActivityChart data={dailyStats} title="Daily Activity" />
        </div>

        {/* Project Breakdown */}
        <div>
          <ProjectBreakdown data={projectBreakdown} />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Period Insights
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Most Active Day
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {summary.mostActiveDay
                    ? formatDate(summary.mostActiveDay)
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Top Project
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {projectBreakdown[0]?.projectName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Active Projects
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {projectBreakdown.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

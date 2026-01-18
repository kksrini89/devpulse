/**
 * Analytics Queries
 *
 * Functions for fetching and computing analytics data.
 */

import { db } from "@/lib/db";
import { TIME_PERIODS, type TimePeriod } from "@/lib/constants";
import type { DailyStats, PeriodSummary } from "@/types";

/**
 * Get daily stats for a given period
 */
export async function getDailyStats(period: TimePeriod): Promise<DailyStats[]> {
  const days = TIME_PERIODS[period]?.days || 30;
  return db.stats.getDaily(days);
}

/**
 * Calculate summary metrics for a period
 */
export async function getPeriodSummary(
  period: TimePeriod
): Promise<PeriodSummary> {
  const days = TIME_PERIODS[period]?.days || 30;
  const stats = await db.stats.getDaily(days * 2); // Get double for trend comparison

  const currentPeriod = stats.slice(-days);
  const previousPeriod = stats.slice(0, days);

  // Calculate totals for current period
  const totalCommits = currentPeriod.reduce((sum, d) => sum + d.commits, 0);
  const totalReviews = currentPeriod.reduce((sum, d) => sum + d.reviews, 0);
  const totalDeploys = currentPeriod.reduce((sum, d) => sum + d.deploys, 0);
  const totalHours = currentPeriod.reduce((sum, d) => sum + d.hoursLogged, 0);

  // Calculate totals for previous period
  const prevCommits = previousPeriod.reduce((sum, d) => sum + d.commits, 0);
  const prevHours = previousPeriod.reduce((sum, d) => sum + d.hoursLogged, 0);

  // Find most active day
  const mostActiveDay = currentPeriod.reduce(
    (max, d) => (d.commits > max.commits ? d : max),
    currentPeriod[0]
  );

  // Calculate trends
  const commitsTrend = prevCommits > 0 ? (totalCommits - prevCommits) / prevCommits : 0;
  const hoursTrend = prevHours > 0 ? (totalHours - prevHours) / prevHours : 0;

  return {
    totalCommits,
    totalReviews,
    totalDeploys,
    totalHours: Math.round(totalHours),
    avgCommitsPerDay: Math.round(totalCommits / days),
    avgHoursPerDay: Math.round((totalHours / days) * 10) / 10,
    mostActiveDay: mostActiveDay?.date || "",
    commitsTrend,
    hoursTrend,
  };
}

/**
 * Get activity breakdown by project
 */
export async function getProjectBreakdown() {
  const projects = await db.projects.findManyWithStats();

  const totalCommits = projects.reduce((sum, p) => sum + p.totalCommits, 0);
  const totalHours = projects.reduce((sum, p) => sum + p.totalHours, 0);

  return projects
    .map((p) => ({
      projectId: p.id,
      projectName: p.name,
      projectColor: p.color,
      commits: p.totalCommits,
      hours: p.totalHours,
      percentage: totalCommits > 0 ? p.totalCommits / totalCommits : 0,
    }))
    .sort((a, b) => b.commits - a.commits);
}

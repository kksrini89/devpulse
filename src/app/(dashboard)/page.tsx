import { Header } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { db } from "@/lib/db";
import { formatNumber, formatDuration, formatRelative } from "@/lib/utils";
import {
  FolderKanban,
  GitCommit,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";

/**
 * Dashboard Home Page (Server Component)
 *
 * This is the main dashboard showing:
 * - Overview stats cards
 * - Recent activity
 * - Project summary
 *
 * As a Server Component, we can fetch data directly without useEffect.
 */
export default async function DashboardPage() {
  // Parallel data fetching - both requests start simultaneously
  const [stats, recentActivities, projects] = await Promise.all([
    db.stats.getOverview(),
    db.activities.findManyWithProject(5),
    db.projects.findManyWithStats(),
  ]);

  return (
    <>
      <Header
        title="Dashboard"
        description="Overview of your development activity"
      />

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Projects"
          value={formatNumber(stats.totalProjects)}
          subtitle={`${stats.activeProjects} active`}
          icon={<FolderKanban className="h-5 w-5" />}
          trend={12}
        />
        <StatsCard
          title="Total Commits"
          value={formatNumber(stats.totalCommits)}
          subtitle="Last 30 days"
          icon={<GitCommit className="h-5 w-5" />}
          trend={8}
        />
        <StatsCard
          title="Hours Logged"
          value={formatDuration(stats.totalHours)}
          subtitle="Last 30 days"
          icon={<Clock className="h-5 w-5" />}
          trend={-3}
        />
        <StatsCard
          title="Recent Activity"
          value={formatNumber(stats.recentActivities)}
          subtitle="Last 7 days"
          icon={<Activity className="h-5 w-5" />}
          trend={15}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-sm"
                >
                  <div
                    className="mt-1 h-2 w-2 rounded-full"
                    style={{ backgroundColor: activity.projectColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-gray-900 dark:text-gray-100">
                      {activity.description}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {activity.projectName} •{" "}
                      {formatRelative(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/analytics"
              className="mt-4 block text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              View all activity →
            </Link>
          </CardContent>
        </Card>

        {/* Projects Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-gray-900 dark:text-gray-100">
                      {project.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {project.totalCommits} commits •{" "}
                      {formatDuration(project.totalHours)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/projects"
              className="mt-4 block text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              View all projects →
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Stats Card Component (could extract to separate file)
interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: number;
}

function StatsCard({ title, value, subtitle, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            {icon}
          </div>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-sm ${
                trend >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

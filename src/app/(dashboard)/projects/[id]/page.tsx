import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { ProjectForm } from "@/features/projects/components";
import { getProject, getProjectActivities } from "@/features/projects/queries";
import { PROJECT_STATUSES, ACTIVITY_TYPES } from "@/lib/constants";
import { formatDate, formatRelative, formatNumber, formatDuration } from "@/lib/utils";
import { ArrowLeft, GitCommit, Clock, Calendar } from "lucide-react";

/**
 * Project Detail Page (Server Component)
 *
 * Dynamic route: /projects/[id]
 * Shows project details and edit form.
 */

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;

  // Parallel data fetching
  const [project, activities] = await Promise.all([
    getProject(id),
    getProjectActivities(id),
  ]);

  // Handle not found
  if (!project) {
    notFound();
  }

  const statusConfig = PROJECT_STATUSES[project.status];

  return (
    <>
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      {/* Header with project info */}
      <div className="mb-8 flex items-start gap-4">
        <div
          className="h-12 w-12 rounded-xl shrink-0"
          style={{ backgroundColor: project.color }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {project.name}
            </h1>
            <Badge variant={statusConfig.color as "green" | "yellow" | "blue"}>
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Created {formatDate(project.createdAt)}
          </p>
        </div>
      </div>

      {/* Stats and Activity */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <StatCard
          icon={<GitCommit className="h-5 w-5" />}
          label="Total Commits"
          value={formatNumber(project.totalCommits)}
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Hours Logged"
          value={formatDuration(project.totalHours)}
        />
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          label="Last Activity"
          value={project.lastActivity ? formatRelative(project.lastActivity) : "Never"}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Project</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm project={project} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No activity recorded yet.
              </p>
            ) : (
              <div className="space-y-4">
                {activities.slice(0, 10).map((activity) => {
                  const typeConfig = ACTIVITY_TYPES[activity.type];
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Badge
                        variant={typeConfig.color as "green" | "blue" | "purple" | "orange"}
                        size="sm"
                      >
                        {typeConfig.label}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-gray-900 dark:text-gray-100">
                          {activity.description}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {formatRelative(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

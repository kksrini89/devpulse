import Link from "next/link";
import { Badge, Card, CardContent } from "@/components/ui";
import { PROJECT_STATUSES } from "@/lib/constants";
import { formatRelative, formatNumber, formatDuration } from "@/lib/utils";
import { GitCommit, Clock, Calendar } from "lucide-react";
import { DeleteProjectButton } from "./DeleteProjectButton";
import type { ProjectWithStats } from "@/types";

interface ProjectCardProps {
  project: ProjectWithStats;
}

/**
 * Project Card (Server Component)
 *
 * Displays a single project with its stats.
 * The only Client Component here is DeleteProjectButton.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const statusConfig = PROJECT_STATUSES[project.status];

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          {/* Project Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <Link
                href={`/projects/${project.id}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 truncate dark:text-white dark:hover:text-blue-400"
              >
                {project.name}
              </Link>
              <Badge
                variant={statusConfig.color as "green" | "yellow" | "blue"}
                size="sm"
              >
                {statusConfig.label}
              </Badge>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
              {project.description || "No description"}
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <GitCommit className="h-4 w-4" />
                <span>{formatNumber(project.totalCommits)} commits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(project.totalHours)}</span>
              </div>
              {project.lastActivity && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Last active {formatRelative(project.lastActivity)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/projects/${project.id}`}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Edit
            </Link>
            <DeleteProjectButton id={project.id} name={project.name} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

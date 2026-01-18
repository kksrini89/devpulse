import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { ProjectCard } from "@/features/projects/components";
import { getProjects } from "@/features/projects/queries";

export const metadata: Metadata = {
  title: "Projects",
  description: "Manage and track all your development projects",
};

/**
 * Projects List Page (Server Component)
 *
 * Displays all projects with their stats.
 * Data is fetched on the server — no useEffect needed.
 */
export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <Header
        title="Projects"
        description={`${projects.length} projects total`}
        actions={
          <Link href="/projects/new">
            <Button>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        }
      />

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
        <Plus className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
        No projects yet
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Get started by creating your first project
      </p>
      <Link href="/projects/new">
        <Button>
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </Link>
    </div>
  );
}

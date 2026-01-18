import Link from "next/link";
import { Header } from "@/components/layout";
import { ProjectForm } from "@/features/projects/components";
import { ArrowLeft } from "lucide-react";

/**
 * New Project Page (Server Component)
 *
 * Renders the project form for creating a new project.
 * The form itself is a Client Component (needs state).
 */
export default function NewProjectPage() {
  return (
    <>
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      <Header
        title="New Project"
        description="Create a new project to track your work"
      />

      <ProjectForm />
    </>
  );
}

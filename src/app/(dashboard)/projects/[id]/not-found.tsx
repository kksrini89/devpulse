import Link from "next/link";
import { Button } from "@/components/ui";
import { FolderX } from "lucide-react";

/**
 * Project Not Found Page
 *
 * Displayed when notFound() is called or project doesn't exist.
 */
export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
        <FolderX className="h-8 w-8 text-gray-400" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Project not found
      </h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        The project you&apos;re looking for doesn&apos;t exist or has been deleted.
      </p>
      <Link href="/projects">
        <Button variant="secondary">Back to Projects</Button>
      </Link>
    </div>
  );
}

"use client";

/**
 * Delete Project Button (Client Component)
 *
 * This is a Client Component because it needs:
 * - onClick handler
 * - useTransition for pending state
 * - confirm dialog
 *
 * It's kept minimal — just the interactive part.
 */

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProject } from "../actions";

interface DeleteProjectButtonProps {
  id: string;
  name: string;
}

export function DeleteProjectButton({ id, name }: DeleteProjectButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Delete "${name}"? This action cannot be undone.`)) {
      startTransition(async () => {
        const result = await deleteProject(id);
        if (result?.error) {
          alert(result.error);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
      title="Delete project"
    >
      {isPending ? (
        <span className="h-4 w-4 block animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}

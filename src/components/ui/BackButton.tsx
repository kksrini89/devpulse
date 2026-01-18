"use client";

/**
 * Back Button (Client Component)
 *
 * A button that navigates back in browser history.
 * Must be a Client Component because it uses browser APIs.
 */

import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-medium transition-colors dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
    >
      <ArrowLeft className="h-4 w-4" />
      Go Back
    </button>
  );
}

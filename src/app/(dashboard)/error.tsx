"use client";

import { Button, Card, CardContent } from "@/components/ui";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Dashboard Error Boundary
 *
 * This file catches errors in the dashboard route segment.
 * It must be a Client Component because it uses the reset() callback.
 *
 * When an error occurs:
 * 1. This UI replaces the page content
 * 2. User can click "Try again" to re-render
 * 3. The layout remains intact
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Something went wrong
          </h2>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {error.message || "An unexpected error occurred"}
          </p>
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

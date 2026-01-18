import Link from "next/link";
import { Home } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";

/**
 * Global 404 Page
 *
 * Shown when:
 * - User navigates to a non-existent route
 * - notFound() is called and no closer not-found.tsx exists
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <span className="text-8xl font-bold text-gray-200 dark:text-gray-800">
            404
          </span>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Page not found
        </h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400 max-w-md">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
          <BackButton />
        </div>
      </div>
    </div>
  );
}

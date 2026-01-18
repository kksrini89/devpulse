import { Sidebar } from "@/components/layout";

/**
 * Dashboard Layout
 *
 * This layout wraps all pages within the (dashboard) route group.
 * The parentheses make this a "route group" - it organizes routes
 * without affecting the URL structure.
 *
 * /projects → not /(dashboard)/projects
 *
 * All pages in this group share:
 * - Sidebar navigation
 * - Common padding and max-width
 * - Authentication (to be added later)
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Skip link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      {/* Sidebar - fixed on the left */}
      <Sidebar />

      {/* Main content area - offset by sidebar width */}
      <main id="main-content" className="flex-1 lg:ml-64">
        <div className="p-4 pt-16 lg:p-8 lg:pt-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

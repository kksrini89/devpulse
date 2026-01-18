import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Empty State Component
 *
 * A consistent way to display empty states across the app.
 * Use when there's no data to show.
 */

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
          <div className="h-8 w-8 text-gray-400">{icon}</div>
        </div>
      )}
      <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

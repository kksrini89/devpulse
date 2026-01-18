import { Skeleton, SkeletonCard } from "@/components/ui";

/**
 * Projects Loading State
 */
export default function ProjectsLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonCard key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}

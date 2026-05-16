import { Skeleton } from "@repo/ui/core/skeleton";

export const WorkspaceIterationFormSkeleton = () => (
  <div className="w-full space-y-5 lg:w-100 lg:shrink-0">
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <div className="space-y-4">
        {/* Attributes block */}
        <div className="space-y-3 rounded-lg bg-muted/50 p-3">
          <Skeleton className="h-3 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Furniture photos field */}
        <Skeleton className="h-20 w-full rounded-lg" />

        {/* Generate button */}
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  </div>
);

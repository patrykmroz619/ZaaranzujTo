import { Skeleton } from "@repo/ui/core/skeleton";

export const WorkspacePreviewSkeleton = () => (
  <div className="flex-1 space-y-4">
    <div className="rounded-xl border bg-card shadow-card overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
    </div>
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-16 shrink-0 rounded-lg" />
      ))}
    </div>
  </div>
);

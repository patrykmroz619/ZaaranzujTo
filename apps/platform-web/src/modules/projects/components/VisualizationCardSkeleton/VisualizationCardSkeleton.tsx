import { Card, CardContent } from "@repo/ui/core/card";
import { Skeleton } from "@repo/ui/core/skeleton";

export const VisualizationCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardContent className="p-4">
        <Skeleton className="h-4 w-3/4" />
        <div className="mt-1 flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
};

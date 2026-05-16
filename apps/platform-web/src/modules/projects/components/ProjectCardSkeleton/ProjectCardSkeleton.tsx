import { Card, CardContent } from "@repo/ui/core/card";
import { Skeleton } from "@repo/ui/core/skeleton";

export const ProjectCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="mt-4 flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

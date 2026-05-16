import { Card, CardContent } from "@repo/ui/core/card";
import { Skeleton } from "@repo/ui/core/skeleton";

export const CreditPackageCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6 pt-8">
        <Skeleton className="h-6 w-28" />
        <div className="my-4 flex flex-col items-center gap-2">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="mb-4 h-7 w-20" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
};

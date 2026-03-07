import { Card, CardContent } from '@/core/ui/base/card';
import { Skeleton } from '@/core/ui/base/skeleton';

export const CourseCardSkeleton = () => {
  return (
    <Card className="h-full overflow-hidden border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="relative h-24 bg-linear-to-r from-primary to-primary/70 p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-10 rounded-md bg-background/30" />
            <Skeleton className="h-6 w-16 rounded-full bg-background/30" />
          </div>

          <div className="absolute -bottom-8 right-4 flex h-16 w-16 items-center justify-center rounded-xl bg-card shadow-md">
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>

        <div className="space-y-4 p-5 pt-6">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-full" />

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

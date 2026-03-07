import { CourseCardSkeleton } from '../CourseCard';

type TCoursesGridSkeletonProps = {
  count?: number;
};

export const CoursesGridSkeleton = (props: TCoursesGridSkeletonProps) => {
  const { count = 4 } = props;
  const coursesSkeletonItems = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {coursesSkeletonItems.map((item) => (
        <CourseCardSkeleton key={item} />
      ))}
    </div>
  );
};

import type { TCourseSummary } from '@repo/contracts/curriculum';
import { getTranslations } from 'next-intl/server';

import {
  CourseCard,
  type TCourseSummaryWithProgress,
} from '@/core/ui/CourseCard';

type TCoursesGridProps = {
  courses: TCourseSummaryWithProgress[];
};

export const CoursesGrid = async (props: TCoursesGridProps) => {
  const { courses } = props;
  const t = await getTranslations('coursesList');

  if (courses.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {t('emptyState')}
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {courses.map((course) => (
        <CourseCard key={course.courseId} course={course} />
      ))}
    </div>
  );
};

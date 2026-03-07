'use client';

import type { TCourseSummary } from '@repo/contracts/curriculum';
import Link from 'next/link';
import { BookOpen, Check, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/core/ui/base/badge';
import { Card, CardContent } from '@/core/ui/base/card';
import { Progress } from '@/core/ui/base/progress';

export type TCourseSummaryWithProgress = TCourseSummary & {
  completedLessons?: number;
};

type TCourseCardProps = {
  course: TCourseSummaryWithProgress;
};

export const CourseCard = (props: TCourseCardProps) => {
  const { course } = props;
  const t = useTranslations('courseCard');

  const completedLessons = course.completedLessons;
  const progressValue =
    completedLessons !== undefined
      ? Math.round((completedLessons / course.totalLessons) * 100)
      : 0;
  const totalLessons = course.totalLessons;

  const statusIcon = (() => {
    if (progressValue >= 100) {
      return <Check className="h-8 w-8 text-primary" />;
    }

    if (progressValue > 0) {
      return <BookOpen className="h-8 w-8 text-primary" />;
    }

    if (course.isPremium) {
      return <Lock className="h-8 w-8 text-muted-foreground" />;
    }

    return <BookOpen className="h-8 w-8 text-muted-foreground" />;
  })();

  return (
    <Link href={`/courses/${course.slug}`} className="block h-full group">
      <Card className="h-full overflow-hidden border-0 shadow-sm transition-all duration-300 hover:shadow-md">
        <CardContent className="p-0">
          <div className="relative h-24 bg-linear-to-r from-primary to-primary/70 p-5">
            <div className="flex items-center justify-between">
              <span className="text-4xl leading-none">📘</span>
              {course.isPremium ? (
                <span className="rounded-full bg-background/20 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
                  {t('premium')}
                </span>
              ) : null}
            </div>

            <div className="absolute -bottom-8 right-4 flex h-16 w-16 items-center justify-center rounded-xl bg-card shadow-md">
              {statusIcon}
            </div>
          </div>

          <div className="space-y-4 p-5 pt-6">
            <h3 className="text-lg font-bold transition-colors group-hover:text-primary">
              {course.title}
            </h3>

            <p className="text-sm text-muted-foreground">
              {course.description}
            </p>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {course.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              {completedLessons !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t('progress')}
                    </span>
                    <span className="font-semibold">
                      {completedLessons}/{totalLessons} {t('lessons')}
                    </span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

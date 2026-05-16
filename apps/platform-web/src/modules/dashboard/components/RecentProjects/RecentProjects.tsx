"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Card, CardContent } from "@repo/ui/core/card";
import type { TProjectObject } from "@repo/contracts";
import { ProjectCard } from "@/modules/projects/components/ProjectCard";
import { ProjectCardSkeleton } from "@/modules/projects/components/ProjectCardSkeleton";

type TRecentProjectsProps = {
  projects: TProjectObject[];
  isLoading?: boolean;
};

export const RecentProjects = (props: TRecentProjectsProps) => {
  const { projects, isLoading } = props;
  const router = useRouter();
  const t = useTranslations("dashboard");

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {t("recentProjects")}
              </p>
              <h3 className="font-display text-lg text-foreground mt-0.5">{t("continueWork")}</h3>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <h3 className="font-display text-lg text-foreground">{t("emptyTitle")}</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-sm">{t("emptyDescription")}</p>
          <Button onClick={() => router.push("/projects")} className="gap-1.5">
            <Plus className="h-4 w-4" />
            {t("emptyCta")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("recentProjects")}
            </p>
            <h3 className="font-display text-lg text-foreground mt-0.5">{t("continueWork")}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/projects")}
            className="gap-1 text-muted-foreground"
          >
            {t("allProjects")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

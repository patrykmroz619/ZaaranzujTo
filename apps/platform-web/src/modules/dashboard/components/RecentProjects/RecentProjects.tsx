"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Card, CardContent } from "@repo/ui/core/card";
import type { TRecentProject } from "../../types/dashboard.types";

type TRecentProjectsProps = {
  projects: TRecentProject[];
};

export const RecentProjects = (props: TRecentProjectsProps) => {
  const { projects } = props;
  const router = useRouter();
  const t = useTranslations("dashboard");

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
            {t("myProjects")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <button
              key={project.id}
              onClick={() => router.push(`/projects/${project.id}`)}
              className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 group"
            >
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="h-14 w-16 shrink-0 rounded-md object-cover"
                />
              ) : (
                <div className="h-14 w-16 shrink-0 rounded-md bg-muted" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                <p className="text-xs text-muted-foreground">
                  {project.visualizations} {t("visualizations")}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

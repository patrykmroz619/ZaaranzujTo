"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { PageHeader } from "@repo/ui/components/page-header";
import { VisualizationCard } from "@/modules/projects/components/VisualizationCard";
import { MOCK_VISUALIZATIONS } from "@/modules/projects/data/mock-projects";

type TProjectDetailViewProps = {
  projectId: string;
};

export const ProjectDetailView = (props: TProjectDetailViewProps) => {
  const { projectId } = props;
  const router = useRouter();
  const t = useTranslations();

  const data = MOCK_VISUALIZATIONS[projectId] || {
    projectName: t("project.title"),
    visualizations: [],
  };

  return (
    <div className="space-y-5">
      <PageHeader title={data.projectName} backHref="/projects" backLabel={t("common.back")}>
        <Button
          onClick={() => router.push(`/projects/${projectId}/workspace/new`)}
          className="gradient-warm text-primary-foreground border-0 gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          {t("project.newVisualization")}
        </Button>
      </PageHeader>

      {data.visualizations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="mb-2 font-display text-xl text-foreground">{t("project.emptyTitle")}</h2>
          <p className="mb-6 text-muted-foreground">{t("project.emptyDescription")}</p>
          <Button
            onClick={() => router.push(`/projects/${projectId}/workspace/new`)}
            className="gradient-warm text-primary-foreground border-0 gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("project.emptyCta")}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.visualizations.map((vis) => (
            <VisualizationCard key={vis.id} visualization={vis} projectId={projectId} />
          ))}
        </div>
      )}
    </div>
  );
};

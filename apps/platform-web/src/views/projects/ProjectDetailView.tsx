"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { PageHeader } from "@repo/ui/components/page-header";
import { DeleteVisualizationDialog } from "@/modules/projects/components/DeleteVisualizationDialog";
import { VisualizationCard } from "@/modules/projects/components/VisualizationCard";
import { VisualizationCardSkeleton } from "@/modules/projects/components/VisualizationCardSkeleton";
import { useProject } from "@/modules/projects/hooks/use-project";
import { useProjectVisualizations } from "@/modules/projects/hooks/use-project-visualizations";
import { useVisualizationDeleteFlow } from "@/modules/projects/hooks/use-visualization-delete-flow";
import { formatRelativeDate } from "@/core/lib/format-date";

type TProjectDetailViewProps = {
  projectId: string;
};

export const ProjectDetailView = (props: TProjectDetailViewProps) => {
  const { projectId } = props;
  const router = useRouter();
  const t = useTranslations();

  const { project } = useProject({ projectId });
  const { visualizations, isLoading, error } = useProjectVisualizations({ projectId });
  const {
    isDeleteDialogOpen,
    isDeleting,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteVisualization,
  } = useVisualizationDeleteFlow({ projectId });
  const visualizationItems = visualizations?.items ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title={project?.name ?? t("project.title")}
        subtitle={
          project
            ? `${t("dashboard.modified")}: ${formatRelativeDate(project.updatedAt)}`
            : undefined
        }
        backHref="/projects"
        backLabel={t("common.back")}
      >
        <div className="w-full sm:ml-auto sm:w-auto">
          <Button
            onClick={() => router.push(`/projects/${projectId}/workspace/new`)}
            className="gradient-warm text-primary-foreground border-0 gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            {t("project.newVisualization")}
          </Button>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <VisualizationCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <p className="text-muted-foreground">{t("errors.500")}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            {t("errors.retry")}
          </Button>
        </div>
      ) : visualizationItems.length === 0 ? (
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
          {visualizationItems.map((vis) => (
            <VisualizationCard
              key={vis.id}
              visualization={vis}
              projectId={projectId}
              onDelete={openDeleteDialog}
            />
          ))}
        </div>
      )}

      <DeleteVisualizationDialog
        open={isDeleteDialogOpen}
        isPending={isDeleting}
        onOpenChange={(open) => {
          if (!open) {
            closeDeleteDialog();
          }
        }}
        onConfirm={handleDeleteVisualization}
      />
    </div>
  );
};

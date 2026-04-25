"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { PageHeader } from "@repo/ui/components/page-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/core/dropdown-menu";
import { DeleteVisualizationDialog } from "@/modules/projects/components/DeleteVisualizationDialog";
import { useVisualizationDeleteFlow } from "@/modules/projects/hooks/use-visualization-delete-flow";
import { WorkspaceIterationForm } from "@/modules/workspace/components/WorkspaceIterationForm";
import { WorkspacePreview } from "@/modules/workspace/components/WorkspacePreview";
import { useWorkspace } from "@/modules/workspace/hooks/use-workspace";

type TWorkspaceViewProps = {
  projectId: string;
  visualizationId: string;
};

export const WorkspaceView = (props: TWorkspaceViewProps) => {
  const { projectId, visualizationId } = props;
  const router = useRouter();
  const t = useTranslations();
  const {
    isDeleteDialogOpen,
    isDeleting,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteVisualization,
  } = useVisualizationDeleteFlow({
    projectId,
    onDeleted: () => {
      router.push(`/projects/${projectId}`);
    },
  });

  const {
    isGenerating,
    creditBalance,
    activeIterationId,
    iterations,
    visualizationAttributes,
    visualizationName,
    onIterate,
    onSelectIteration,
  } = useWorkspace({ visualizationId });

  return (
    <div className="space-y-5">
      <PageHeader
        title={visualizationName || t("workspace.editTitle")}
        backHref={`/projects/${projectId}`}
        backLabel={t("common.back")}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive"
              disabled={isDeleting}
              onClick={() => openDeleteDialog(visualizationId)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("project.deleteVisualization")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>

      <div className="flex flex-col gap-6 lg:flex-row">
        {visualizationAttributes && (
          <WorkspaceIterationForm
            visualizationAttributes={visualizationAttributes}
            isGenerating={isGenerating}
            creditBalance={creditBalance}
            onSubmit={onIterate}
          />
        )}

        <WorkspacePreview
          isGenerating={isGenerating}
          hasResult={iterations.length > 0}
          iterations={iterations}
          activeIterationId={activeIterationId}
          onSelectIteration={onSelectIteration}
        />
      </div>

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

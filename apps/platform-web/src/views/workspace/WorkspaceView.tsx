"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@repo/ui/components/page-header";
import { WorkspaceForm } from "@/modules/workspace/components/WorkspaceForm";
import { WorkspacePreview } from "@/modules/workspace/components/WorkspacePreview";
import { useWorkspace } from "@/modules/workspace/hooks/use-workspace";

type TWorkspaceViewProps = {
  projectId: string;
  visualizationId: string;
};

export const WorkspaceView = (props: TWorkspaceViewProps) => {
  const { projectId, visualizationId } = props;
  const t = useTranslations();

  const {
    isEditMode,
    hasResult,
    isGenerating,
    creditBalance,
    activeIterationId,
    iterations,
    formDefaultValues,
    onSubmit,
    onSelectIteration,
  } = useWorkspace({ projectId, visualizationId });

  return (
    <div className="space-y-5">
      <PageHeader
        title={isEditMode ? t("workspace.editTitle") : t("workspace.newVisualization")}
        backHref={`/projects/${projectId}`}
        backLabel={t("common.back")}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <WorkspaceForm
          key={activeIterationId || "new"}
          isEditMode={isEditMode}
          isGenerating={isGenerating}
          creditBalance={creditBalance}
          defaultValues={formDefaultValues}
          onSubmit={onSubmit}
        />

        <WorkspacePreview
          isGenerating={isGenerating}
          hasResult={hasResult}
          iterations={iterations}
          activeIterationId={activeIterationId}
          onSelectIteration={onSelectIteration}
        />
      </div>
    </div>
  );
};

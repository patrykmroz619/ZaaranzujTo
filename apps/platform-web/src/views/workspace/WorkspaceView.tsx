"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@repo/ui/components/page-header";
import { WorkspaceIterationForm } from "@/modules/workspace/components/WorkspaceIterationForm";
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
      />

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
    </div>
  );
};

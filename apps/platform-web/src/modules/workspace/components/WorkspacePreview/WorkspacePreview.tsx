"use client";

import { useTranslations } from "next-intl";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import type { TIterationObject } from "@repo/contracts";
import { IterationStrip } from "@/modules/workspace/components/IterationStrip";
import { VisualizationDownloadButton } from "@/modules/workspace/components/VisualizationDownloadButton";
import { useAssetUrl } from "@/modules/storage/hooks/use-asset-url";

type TWorkspacePreviewProps = {
  isGenerating: boolean;
  hasResult: boolean;
  iterations: TIterationObject[];
  activeIterationId: string;
  onSelectIteration: (id: string) => void;
};

export const WorkspacePreview = (props: TWorkspacePreviewProps) => {
  const { isGenerating, hasResult, iterations, activeIterationId, onSelectIteration } = props;
  const t = useTranslations("workspace");

  const activeIteration = iterations.find((it) => it.id === activeIterationId);
  const { url: activeImageUrl } = useAssetUrl(activeIteration?.result?.imageAssetId);

  return (
    <div className="flex-1 space-y-4">
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        {isGenerating ? (
          <div className="flex aspect-video flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{t("generatingMessage")}</p>
          </div>
        ) : hasResult ? (
          <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
            {activeImageUrl && activeIteration ? (
              <>
                <img
                  src={activeImageUrl}
                  alt={t("generatedVisualization")}
                  className="h-full w-full object-cover"
                />
                <VisualizationDownloadButton
                  assetId={activeIteration.result.imageAssetId}
                  iterationId={activeIterationId}
                />
              </>
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto mb-2 h-16 w-16 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">{t("generatedVisualization")}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-2">
            <ImageIcon className="h-16 w-16 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">{t("emptyVisualization")}</p>
            <p className="text-xs text-muted-foreground/70">{t("emptyVisualizationHint")}</p>
          </div>
        )}
      </div>

      <IterationStrip
        iterations={iterations}
        activeIterationId={activeIterationId}
        onSelect={onSelectIteration}
      />
    </div>
  );
};

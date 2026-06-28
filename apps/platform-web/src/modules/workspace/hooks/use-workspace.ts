"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "@repo/ui/core/sonner";
import { useProfile } from "@/core/packages/profile/use-profile";
import { useVisualization } from "@/modules/workspace/hooks/use-visualization";
import { ApiError } from "@/core/packages/http";
import { useCreateIteration } from "@/modules/workspace/hooks/use-create-iteration";
import type { TWorkspaceIterationValues } from "@/modules/workspace/types/workspace.types";

type TUseWorkspaceParams = {
  visualizationId: string;
};

export const useWorkspace = (params: TUseWorkspaceParams) => {
  const { visualizationId } = params;
  const t = useTranslations();

  const [activeIterationId, setActiveIterationId] = useState("");

  const { profile } = useProfile();
  const { visualization, isLoading } = useVisualization(visualizationId);

  const createIteration = useCreateIteration();

  const creditBalance = profile?.creditBalance ?? 0;
  const isGenerating = createIteration.isPending;

  const iterations = visualization?.iterations ?? [];

  const visualizationAttributes = visualization
    ? {
        stylePreset: visualization.stylePreset,
        palette: visualization.palette,
        roomType: visualization.roomType,
        originalPhotoAssetId: visualization.iterations[0]?.generationInput?.inputAsset ?? null,
      }
    : null;

  const lastIterationId = visualization?.iterations[visualization.iterations.length - 1]?.id ?? "";
  const resolvedActiveIterationId = iterations.some((it) => it.id === activeIterationId)
    ? activeIterationId
    : lastIterationId;

  const onIterate = async (values: TWorkspaceIterationValues): Promise<boolean> => {
    if (!resolvedActiveIterationId) return false;

    const formData = new FormData();
    formData.append("parentIterationId", resolvedActiveIterationId);
    formData.append("prompt", values.prompt);
    values.furniturePhotoFiles.forEach((file) => formData.append("referencePhotos", file));

    try {
      const result = await createIteration.mutateAsync({ visualizationId, formData });
      if (result) {
        setActiveIterationId(result.iteration.iterationId);
      }
      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.code) {
          case "CONTENT_POLICY_VIOLATION":
            toast.error(t("errors.contentPolicyViolation"));
            break;
          case "INSUFFICIENT_CREDITS":
            toast.error(t("errors.402"));
            break;
          case "FILE_TOO_LARGE":
            toast.error(t("errors.fileTooLarge"));
            break;
          case "ACTIVE_GENERATION_CONFLICT":
            toast.error(t("errors.409"));
            break;
          default:
            toast.error(err.statusCode === 0 ? t("errors.network") : t("errors.500"));
        }
      } else {
        toast.error(t("errors.500"));
      }
      return false;
    }
  };

  const onSelectIteration = (iterationId: string) => {
    setActiveIterationId(iterationId);
  };

  return {
    isLoading,
    isGenerating,
    creditBalance,
    activeIterationId: resolvedActiveIterationId,
    iterations,
    visualizationAttributes,
    visualizationName: visualization?.name ?? "",
    onIterate,
    onSelectIteration,
  };
};

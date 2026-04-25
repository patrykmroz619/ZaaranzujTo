"use client";

import { useState, useEffect } from "react";
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
  const { visualization } = useVisualization(visualizationId);

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

  useEffect(() => {
    if (!visualization) return;
    const lastIteration = visualization.iterations[visualization.iterations.length - 1];
    if (lastIteration) {
      setActiveIterationId(lastIteration.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visualization?.id]);

  const onIterate = async (values: TWorkspaceIterationValues) => {
    if (!activeIterationId) return;

    const formData = new FormData();
    formData.append("parentIterationId", activeIterationId);
    formData.append("prompt", values.prompt);
    values.furniturePhotoFiles.forEach((file) => formData.append("referencePhotos", file));

    try {
      const result = await createIteration.mutateAsync({ visualizationId, formData });
      if (result) {
        setActiveIterationId(result.iteration.iterationId);
      }
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
    }
  };

  const onSelectIteration = (iterationId: string) => {
    setActiveIterationId(iterationId);
  };

  return {
    isGenerating,
    creditBalance,
    activeIterationId,
    iterations,
    visualizationAttributes,
    visualizationName: visualization?.name ?? "",
    onIterate,
    onSelectIteration,
  };
};

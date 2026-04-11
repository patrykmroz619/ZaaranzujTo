"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "@repo/ui/core/sonner";
import { useProfile } from "@/core/packages/profile/use-profile";
import { useVisualization } from "@/modules/workspace/hooks/use-visualization";
import { useCreateVisualization } from "@/modules/workspace/hooks/use-create-visualization";
import { useUpdateVisualization } from "@/modules/workspace/hooks/use-update-visualization";
import { useCreateIteration } from "@/modules/workspace/hooks/use-create-iteration";
import { storageApi } from "@/modules/storage/api/storage.api";
import type { TWorkspaceFormValues } from "@/modules/workspace/types/workspace.types";

type TUseWorkspaceParams = {
  projectId: string;
  visualizationId: string;
};

export const useWorkspace = (params: TUseWorkspaceParams) => {
  const { projectId, visualizationId } = params;
  const t = useTranslations();

  const isNew = visualizationId === "new";

  const [createdVizId, setCreatedVizId] = useState<string | null>(null);
  const [lastSavedVisualizationName, setLastSavedVisualizationName] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(!isNew);
  const [isEditMode, setIsEditMode] = useState(!isNew);
  const [activeIterationId, setActiveIterationId] = useState("");

  const effectiveVizId = isNew ? createdVizId : visualizationId;

  const { profile } = useProfile();
  const { visualization } = useVisualization(effectiveVizId);

  const createVisualization = useCreateVisualization();
  const updateVisualization = useUpdateVisualization();
  const createIteration = useCreateIteration();

  const creditBalance = profile?.creditBalance ?? 0;
  const isGenerating =
    createVisualization.isPending || updateVisualization.isPending || createIteration.isPending;

  const iterations = visualization?.iterations ?? [];

  const activeIteration =
    iterations.find((it) => it.id === activeIterationId) ??
    iterations[iterations.length - 1] ??
    null;

  const formDefaultValues: TWorkspaceFormValues = {
    name: visualization?.name ?? "",
    style: activeIteration?.generationInput.stylePreset ?? "",
    palette: activeIteration?.generationInput.colors[0] ?? "",
    roomType: activeIteration?.generationInput.roomType ?? "",
    prompt: activeIteration?.generationInput.prompt ?? "",
    roomPhotoFile: null,
    furniturePhotoFiles: [],
  };

  useEffect(() => {
    if (!visualization) return;

    const lastIteration = visualization.iterations[visualization.iterations.length - 1];
    setLastSavedVisualizationName(visualization.name);

    if (lastIteration) {
      setActiveIterationId(lastIteration.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visualization?.id]);

  const onSubmit = async (values: TWorkspaceFormValues) => {
    const name = values.name.trim();

    try {
      let vizId = effectiveVizId;

      if (isNew && !createdVizId) {
        const newViz = await createVisualization.mutateAsync({ projectId, body: { name } });
        if (!newViz) return;
        vizId = newViz.id;
        setCreatedVizId(newViz.id);
        setLastSavedVisualizationName(name);
      }

      if (!vizId) return;

      if (lastSavedVisualizationName !== null && name !== lastSavedVisualizationName) {
        const updatedVisualization = await updateVisualization.mutateAsync({
          visualizationId: vizId,
          body: { name },
        });
        if (updatedVisualization) {
          setLastSavedVisualizationName(updatedVisualization.name);
        }
      }

      const formData = new FormData();

      if (isEditMode && activeIteration?.result?.imageAssetId) {
        const urlData = await storageApi.getDownloadUrl({
          assetId: activeIteration.result.imageAssetId,
        });
        if (urlData?.downloadUrl) {
          const response = await fetch(urlData.downloadUrl);
          const blob = await response.blob();
          formData.append("inputPhoto", new File([blob], "base-iteration.jpg", { type: blob.type }));
        }
        formData.append("parentIterationId", activeIterationId);
      } else if (values.roomPhotoFile) {
        formData.append("inputPhoto", values.roomPhotoFile);
      }

      if (values.style) formData.append("stylePreset", values.style);
      if (values.palette) formData.append("palette", values.palette);
      if (values.roomType) formData.append("roomType", values.roomType);
      if (values.prompt) formData.append("prompt", values.prompt);
      values.furniturePhotoFiles.forEach((f) => formData.append("referencePhotos", f));

      const result = await createIteration.mutateAsync({ visualizationId: vizId, formData });

      if (result) {
        setHasResult(true);
        setIsEditMode(true);
        setActiveIterationId(result.iteration.iterationId);
      }
    } catch {
      toast.error(t("errors.500"));
    }
  };

  const onSelectIteration = (iterationId: string) => {
    setActiveIterationId(iterationId);
  };

  return {
    isEditMode,
    hasResult,
    isGenerating,
    creditBalance,
    activeIterationId,
    iterations,
    formDefaultValues,
    onSubmit,
    onSelectIteration,
  };
};

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "@repo/ui/core/sonner";

import { ApiError } from "@/core/packages/http";

import { useDeleteVisualization } from "./use-delete-visualization";

type TUseVisualizationDeleteFlowParams = {
  projectId: string;
  onDeleted?: () => void;
};

export const useVisualizationDeleteFlow = (params: TUseVisualizationDeleteFlowParams) => {
  const { projectId, onDeleted } = params;
  const t = useTranslations();
  const [selectedVisualizationId, setSelectedVisualizationId] = useState<string | null>(null);
  const deleteVisualizationMutation = useDeleteVisualization();

  const closeDeleteDialog = () => {
    setSelectedVisualizationId(null);
  };

  const openDeleteDialog = (visualizationId: string) => {
    setSelectedVisualizationId(visualizationId);
  };

  const handleDeleteVisualization = async () => {
    if (!selectedVisualizationId) {
      return;
    }

    try {
      await deleteVisualizationMutation.mutateAsync({
        projectId,
        visualizationId: selectedVisualizationId,
      });
      closeDeleteDialog();
      onDeleted?.();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.statusCode === 0 ? t("errors.network") : t("errors.500"));
      } else {
        toast.error(t("errors.500"));
      }
    }
  };

  return {
    isDeleteDialogOpen: selectedVisualizationId !== null,
    selectedVisualizationId,
    isDeleting: deleteVisualizationMutation.isPending,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteVisualization,
  };
};

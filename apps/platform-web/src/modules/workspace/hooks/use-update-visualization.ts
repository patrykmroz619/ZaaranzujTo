"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TUpdateVisualizationRequest } from "@repo/contracts";

import { queryKeys } from "@/core/packages/query/query-keys";
import { visualizationsApi } from "@/modules/projects/api/visualizations.api";

export const useUpdateVisualization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { visualizationId: string; body: TUpdateVisualizationRequest }) =>
      visualizationsApi.update({
        visualizationId: params.visualizationId,
        body: params.body,
      }),
    onSuccess: (updatedVisualization) => {
      if (!updatedVisualization) return;

      queryClient.invalidateQueries({
        queryKey: queryKeys.visualizations.detail(updatedVisualization.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.visualizations(updatedVisualization.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(updatedVisualization.projectId),
      });
    },
  });
};

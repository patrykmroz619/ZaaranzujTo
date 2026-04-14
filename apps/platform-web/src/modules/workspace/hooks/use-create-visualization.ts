"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/core/packages/query/query-keys";
import { visualizationsApi } from "@/modules/projects/api/visualizations.api";

export const useCreateVisualization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { projectId: string; formData: FormData }) =>
      visualizationsApi.create({
        projectId: params.projectId,
        body: params.formData,
        headers: { idempotencyKey: crypto.randomUUID() },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.visualizations(variables.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(variables.projectId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
};

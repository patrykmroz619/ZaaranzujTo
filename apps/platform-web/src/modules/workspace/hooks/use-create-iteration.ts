"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/core/packages/query/query-keys";
import { iterationsApi } from "@/modules/workspace/api/iterations.api";

export const useCreateIteration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { visualizationId: string; formData: FormData }) =>
      iterationsApi.create({
        visualizationId: params.visualizationId,
        body: params.formData,
        headers: { idempotencyKey: crypto.randomUUID() },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.visualizations.detail(variables.visualizationId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.visualizations.iterations(variables.visualizationId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
};

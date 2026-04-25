"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@repo/ui/core/sonner";
import { useTranslations } from "next-intl";

import { queryKeys } from "@/core/packages/query/query-keys";

import { visualizationsApi } from "../api/visualizations.api";

export const useDeleteVisualization = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("project");

  return useMutation({
    mutationFn: (params: { projectId: string; visualizationId: string }) =>
      visualizationsApi.delete({ visualizationId: params.visualizationId }),
    onSuccess: async (_, params) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.visualizations(params.projectId),
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.detail(params.projectId),
          refetchType: "all",
        }),
      ]);

      queryClient.removeQueries({
        queryKey: queryKeys.visualizations.detail(params.visualizationId),
      });
      toast.success(t("deleteVisualizationSuccess"));
    },
  });
};

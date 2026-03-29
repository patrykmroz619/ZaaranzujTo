"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/packages/query/query-keys";
import { visualizationsApi } from "@/modules/projects/api/visualizations.api";

export const useVisualization = (visualizationId: string | null | undefined) => {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.visualizations.detail(visualizationId ?? ""),
    queryFn: () => visualizationsApi.get({ visualizationId: visualizationId! }),
    enabled: !!visualizationId,
  });

  return { visualization: data, isLoading, error };
};

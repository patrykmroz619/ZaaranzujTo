"use client";

import { useQuery } from "@tanstack/react-query";

import type { TListVisualizationIterationsQuery } from "@repo/contracts";

import { queryKeys } from "@/core/packages/query/query-keys";
import { iterationsApi } from "@/modules/workspace/api/iterations.api";

export const useIterations = (params: {
  visualizationId: string;
  query?: TListVisualizationIterationsQuery;
}) => {
  const { visualizationId, query } = params;
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.visualizations.iterations(visualizationId),
    queryFn: () => iterationsApi.list({ visualizationId, query }),
    enabled: !!visualizationId,
  });

  return { iterations: data, isLoading, error };
};

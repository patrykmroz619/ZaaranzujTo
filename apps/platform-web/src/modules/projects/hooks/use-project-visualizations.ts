"use client";

import { useQuery } from "@tanstack/react-query";

import type { TListProjectVisualizationsQuery } from "@repo/contracts";

import { queryKeys } from "@/core/packages/query/query-keys";
import { visualizationsApi } from "../api/visualizations.api";

export const useProjectVisualizations = (params: {
  projectId: string;
  query?: TListProjectVisualizationsQuery;
}) => {
  const { projectId, query } = params;
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.projects.visualizations(projectId),
    queryFn: () => visualizationsApi.list({ projectId, query }),
    enabled: !!projectId,
  });

  return { visualizations: data, isLoading, error };
};

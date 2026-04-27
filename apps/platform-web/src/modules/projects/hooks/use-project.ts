"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/packages/query/query-keys";

import { projectsApi } from "../api/projects.api";

export const useProject = (params: { projectId: string }) => {
  const { projectId } = params;
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: () => projectsApi.get({ projectId }),
    enabled: !!projectId,
  });

  return { project: data, isLoading, error };
};

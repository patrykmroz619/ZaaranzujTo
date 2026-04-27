"use client";

import { useQuery } from "@tanstack/react-query";

import type { TListProjectsQuery } from "@repo/contracts";

import { queryKeys } from "@/core/packages/query/query-keys";

import { projectsApi } from "../api/projects.api";

export const useProjects = (params?: { query?: TListProjectsQuery }) => {
  const query = params?.query;
  const { data, isLoading, error } = useQuery({
    queryKey: query ? [...queryKeys.projects.all, query] : queryKeys.projects.all,
    queryFn: () => projectsApi.list({ query }),
  });

  return { projects: data, isLoading, error };
};

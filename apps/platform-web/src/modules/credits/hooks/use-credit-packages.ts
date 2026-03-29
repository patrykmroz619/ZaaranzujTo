"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/packages/query/query-keys";

import { creditsApi } from "../api/credits.api";

export const useCreditPackages = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.credits.packages,
    queryFn: () => creditsApi.getPackages(),
    staleTime: 5 * 60 * 1000,
  });

  return { packages: data, isLoading, error };
};

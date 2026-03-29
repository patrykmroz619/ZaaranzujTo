"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/packages/query/query-keys";

import { storageApi } from "../api/storage.api";

export const useAssetUrl = (assetId: string | null | undefined) => {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.storage.asset(assetId ?? ""),
    queryFn: () => storageApi.getDownloadUrl({ assetId: assetId! }),
    enabled: !!assetId,
    staleTime: 50 * 60 * 1000,
  });

  return { url: data?.downloadUrl ?? null, isLoading };
};

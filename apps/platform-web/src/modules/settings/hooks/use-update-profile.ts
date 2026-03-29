"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@repo/ui/core/sonner";
import { useTranslations } from "next-intl";

import type { TUpdateMeRequest } from "@repo/contracts";

import { queryKeys } from "@/core/packages/query/query-keys";
import { meApi } from "../api/me.api";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("settings");

  return useMutation({
    mutationFn: (params: { body: TUpdateMeRequest }) =>
      meApi.updateProfile({ body: params.body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      toast.success(t("title"));
    },
  });
};

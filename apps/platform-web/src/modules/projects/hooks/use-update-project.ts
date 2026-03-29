"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@repo/ui/core/sonner";
import { useTranslations } from "next-intl";

import type { TUpdateProjectRequest } from "@repo/contracts";

import { queryKeys } from "@/core/packages/query/query-keys";

import { projectsApi } from "../api/projects.api";

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: (params: { projectId: string; body: TUpdateProjectRequest }) =>
      projectsApi.update({ projectId: params.projectId, body: params.body }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(variables.projectId),
      });
      toast.success(t("common.save"));
    },
    onError: () => {
      toast.error(t("common.error"));
    },
  });
};

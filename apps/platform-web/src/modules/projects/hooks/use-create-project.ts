"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@repo/ui/core/sonner";
import { useTranslations } from "next-intl";

import type { TCreateProjectRequest } from "@repo/contracts";

import { queryKeys } from "@/core/packages/query/query-keys";

import { projectsApi } from "../api/projects.api";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: (params: { body: TCreateProjectRequest }) =>
      projectsApi.create({ body: params.body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success(t("dashboard.newProject"));
    },
  });
};

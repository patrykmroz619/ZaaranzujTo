"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@repo/ui/core/sonner";
import { useTranslations } from "next-intl";

import { queryKeys } from "@/core/packages/query/query-keys";

import { projectsApi } from "../api/projects.api";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard");

  return useMutation({
    mutationFn: (params: { projectId: string }) =>
      projectsApi.delete({ projectId: params.projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success(t("deleteProject"));
    },
  });
};

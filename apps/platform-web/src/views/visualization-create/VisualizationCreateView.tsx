"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "@repo/ui/core/sonner";
import { PageHeader } from "@repo/ui/components/page-header";
import { useProfile } from "@/core/packages/profile/use-profile";
import { ApiError } from "@/core/packages/http";
import { useCreateVisualization } from "@/modules/workspace/hooks/use-create-visualization";
import { WorkspaceCreateForm } from "@/modules/workspace/components/WorkspaceCreateForm";
import type { TWorkspaceCreateValues } from "@/modules/workspace/types/workspace.types";

type TVisualizationCreateViewProps = {
  projectId: string;
};

export const VisualizationCreateView = (props: TVisualizationCreateViewProps) => {
  const { projectId } = props;
  const t = useTranslations();
  const router = useRouter();

  const { profile } = useProfile();
  const createVisualization = useCreateVisualization();

  const creditBalance = profile?.creditBalance ?? 0;

  const onSubmit = async (values: TWorkspaceCreateValues) => {
    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("stylePreset", values.stylePreset);
    formData.append("palette", values.palette);
    formData.append("roomType", values.roomType);
    if (values.prompt) formData.append("prompt", values.prompt);
    formData.append("inputPhoto", values.roomPhotoFile);
    values.furniturePhotoFiles.forEach((file) => formData.append("referencePhotos", file));

    try {
      const result = await createVisualization.mutateAsync({ projectId, formData });
      if (result) {
        router.push(`/projects/${projectId}/workspace/${result.id}`);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.code) {
          case "CONTENT_POLICY_VIOLATION":
            toast.error(t("errors.contentPolicyViolation"));
            break;
          case "INSUFFICIENT_CREDITS":
            toast.error(t("errors.402"));
            break;
          case "FILE_TOO_LARGE":
            toast.error(t("errors.fileTooLarge"));
            break;
          default:
            toast.error(err.statusCode === 0 ? t("errors.network") : t("errors.500"));
        }
      } else {
        toast.error(t("errors.500"));
      }
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("workspace.newVisualization")}
        backHref={`/projects/${projectId}`}
        backLabel={t("common.back")}
      />

      <WorkspaceCreateForm
        isGenerating={createVisualization.isPending}
        creditBalance={creditBalance}
        onSubmit={onSubmit}
      />
    </div>
  );
};

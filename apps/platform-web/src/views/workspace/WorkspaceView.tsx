"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "@repo/ui/core/sonner";
import { PageHeader } from "@repo/ui/components/page-header";
import { WorkspaceForm } from "@/modules/workspace/components/WorkspaceForm";
import { WorkspacePreview } from "@/modules/workspace/components/WorkspacePreview";
import { useProfile } from "@/core/packages/profile/use-profile";
import { useVisualization } from "@/modules/workspace/hooks/use-visualization";
import { useCreateVisualization } from "@/modules/workspace/hooks/use-create-visualization";
import { useCreateIteration } from "@/modules/workspace/hooks/use-create-iteration";
import { useUpdateVisualization } from "@/modules/workspace/hooks/use-update-visualization";
import type { TWorkspaceFormValues } from "@/modules/workspace/types/workspace.types";

type TWorkspaceViewProps = {
  projectId: string;
  visualizationId: string;
};

export const WorkspaceView = (props: TWorkspaceViewProps) => {
  const { projectId, visualizationId } = props;
  const t = useTranslations();

  const isNew = visualizationId === "new";
  const [createdVizId, setCreatedVizId] = useState<string | null>(null);
  const [lastSavedVisualizationName, setLastSavedVisualizationName] = useState<string | null>(null);
  const effectiveVizId = isNew ? createdVizId : visualizationId;

  const form = useForm<TWorkspaceFormValues>({
    defaultValues: {
      name: "",
      style: "",
      palette: "",
      roomType: "",
      prompt: "",
      roomPhotoFile: null,
      furniturePhotoFiles: [],
    },
  });

  const style = form.watch("style");
  const palette = form.watch("palette");
  const roomType = form.watch("roomType");
  const prompt = form.watch("prompt");
  const furniturePhotoFiles = form.watch("furniturePhotoFiles");
  const visualizationName = form.watch("name");

  // UI state
  const [hasResult, setHasResult] = useState(!isNew);
  const [isEditMode, setIsEditMode] = useState(!isNew);
  const [activeIterationId, setActiveIterationId] = useState("");

  // Real data
  const { profile } = useProfile();
  const { visualization } = useVisualization(effectiveVizId);
  const realIterations = visualization?.iterations ?? [];

  // Set active iteration when visualization loads
  useEffect(() => {
    if (realIterations.length > 0 && !activeIterationId) {
      const last = realIterations[realIterations.length - 1];
      if (last) setActiveIterationId(last.id);
    }
  }, [realIterations, activeIterationId]);

  // Mutations
  const createVisualization = useCreateVisualization();
  const updateVisualization = useUpdateVisualization();
  const createIteration = useCreateIteration();

  const creditBalance = profile?.creditBalance ?? 0;
  const isGenerating =
    createVisualization.isPending || updateVisualization.isPending || createIteration.isPending;

  useEffect(() => {
    if (!visualization) return;

    if (!form.getValues("name")) {
      form.setValue("name", visualization.name);
    }

    if (lastSavedVisualizationName === null) {
      setLastSavedVisualizationName(visualization.name);
    }
  }, [form, visualization, lastSavedVisualizationName]);

  const handleGenerate = async () => {
    const name = visualizationName.trim();

    if (name.length === 0) {
      form.setError("name", { message: t("workspace.visualizationNameRequired") });
      return;
    }

    try {
      let vizId = effectiveVizId;

      if (isNew && !createdVizId) {
        const newViz = await createVisualization.mutateAsync({
          projectId,
          body: { name },
        });
        if (!newViz) return;
        vizId = newViz.id;
        setCreatedVizId(newViz.id);
        setLastSavedVisualizationName(name);
      }

      if (!vizId) return;

      if (lastSavedVisualizationName !== null && name !== lastSavedVisualizationName) {
        const updatedVisualization = await updateVisualization.mutateAsync({
          visualizationId: vizId,
          body: {
            name,
          },
        });

        if (updatedVisualization) {
          setLastSavedVisualizationName(updatedVisualization.name);
        }
      }

      const roomPhotoFile = form.getValues("roomPhotoFile");
      const formData = new FormData();
      if (roomPhotoFile) formData.append("inputPhoto", roomPhotoFile);
      if (style) formData.append("stylePreset", style);
      if (palette) formData.append("palette", palette);
      if (roomType) formData.append("roomType", roomType);
      if (prompt) formData.append("prompt", prompt);
      furniturePhotoFiles.forEach((photoFile) => {
        formData.append("referencePhotos", photoFile);
      });

      const result = await createIteration.mutateAsync({ visualizationId: vizId, formData });

      if (result) {
        setHasResult(true);
        setIsEditMode(true);
        setActiveIterationId(result.iteration.iterationId);
      }
    } catch {
      toast.error(t("errors.500"));
    }
  };

  const canGenerate =
    creditBalance >= 1 &&
    visualizationName.trim() !== "" &&
    style !== "" &&
    roomType !== "";

  return (
    <div className="space-y-5">
      <PageHeader
        title={isEditMode ? t("workspace.editTitle") : t("workspace.newVisualization")}
        backHref={`/projects/${projectId}`}
        backLabel={t("common.back")}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <WorkspaceForm
          isEditMode={isEditMode}
          form={form}
          isGenerating={isGenerating}
          canGenerate={canGenerate}
          creditBalance={creditBalance}
          onGenerate={handleGenerate}
        />

        <WorkspacePreview
          isGenerating={isGenerating}
          hasResult={hasResult}
          iterations={realIterations}
          activeIterationId={activeIterationId}
          onSelectIteration={setActiveIterationId}
        />
      </div>
    </div>
  );
};

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "@repo/ui/core/sonner";
import { PageHeader } from "@repo/ui/components/page-header";
import { WorkspaceForm } from "@/modules/workspace/components/WorkspaceForm";
import { WorkspacePreview } from "@/modules/workspace/components/WorkspacePreview";
import { useProfile } from "@/core/packages/profile/use-profile";
import { useVisualization } from "@/modules/workspace/hooks/use-visualization";
import { useCreateVisualization } from "@/modules/workspace/hooks/use-create-visualization";
import { useCreateIteration } from "@/modules/workspace/hooks/use-create-iteration";
import type { TGenerationMode } from "@/modules/workspace/types/workspace.types";

type TWorkspaceViewProps = {
  projectId: string;
  visualizationId: string;
};

export const WorkspaceView = (props: TWorkspaceViewProps) => {
  const { projectId, visualizationId } = props;
  const t = useTranslations();

  const isNew = visualizationId === "new";
  const [createdVizId, setCreatedVizId] = useState<string | null>(null);
  const effectiveVizId = isNew ? createdVizId : visualizationId;

  // Form state
  const [mode, setMode] = useState<TGenerationMode>("photo");
  const [style, setStyle] = useState("");
  const [palette, setPalette] = useState("");
  const [roomType, setRoomType] = useState("");
  const [prompt, setPrompt] = useState("");
  const [roomPhotoFile, setRoomPhotoFile] = useState<File | null>(null);
  const [roomPhotoPreview, setRoomPhotoPreview] = useState<string | null>(null);

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
  const createIteration = useCreateIteration();

  const creditBalance = profile?.creditBalance ?? 0;
  const isGenerating = createVisualization.isPending || createIteration.isPending;

  const handleRoomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRoomPhotoFile(file);
      setRoomPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    try {
      let vizId = effectiveVizId;

      if (isNew && !createdVizId) {
        const contractMode = mode === "photo" ? "fromPhoto" : "fromScratch";
        const newViz = await createVisualization.mutateAsync({
          projectId,
          body: { name: t("workspace.newVisualization"), mode: contractMode },
        });
        if (!newViz) return;
        vizId = newViz.id;
        setCreatedVizId(newViz.id);
      }

      if (!vizId) return;

      const formData = new FormData();
      if (roomPhotoFile) formData.append("inputPhoto", roomPhotoFile);
      formData.append("stylePreset", style);
      if (prompt) formData.append("promptContext", prompt);

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
    style !== "" &&
    roomType !== "" &&
    (mode === "photo" ? !!roomPhotoPreview : !!prompt.trim());

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
          mode={mode}
          onModeChange={setMode}
          style={style}
          onStyleChange={setStyle}
          palette={palette}
          onPaletteChange={setPalette}
          roomType={roomType}
          onRoomTypeChange={setRoomType}
          prompt={prompt}
          onPromptChange={setPrompt}
          roomPhotoPreview={roomPhotoPreview}
          onRoomPhotoUpload={handleRoomPhotoUpload}
          onRoomPhotoRemove={() => {
            setRoomPhotoFile(null);
            setRoomPhotoPreview(null);
          }}
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

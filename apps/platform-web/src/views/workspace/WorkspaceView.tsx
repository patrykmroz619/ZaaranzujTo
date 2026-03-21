"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@repo/ui/components/page-header";
import { WorkspaceForm } from "@/modules/workspace/components/WorkspaceForm";
import { WorkspacePreview } from "@/modules/workspace/components/WorkspacePreview";
import type { TGenerationMode } from "@/modules/workspace/types/workspace.types";
import type { TIteration } from "@/modules/projects/types/projects.types";

type TWorkspaceViewProps = {
  projectId: string;
  visualizationId: string;
};

export const WorkspaceView = (props: TWorkspaceViewProps) => {
  const { projectId, visualizationId } = props;
  const t = useTranslations();

  const isNew = visualizationId === "new";
  const [mode, setMode] = useState<TGenerationMode>("photo");
  const [style, setStyle] = useState("");
  const [palette, setPalette] = useState("");
  const [roomType, setRoomType] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(!isNew);
  const [isEditMode, setIsEditMode] = useState(!isNew);
  const [roomPhotoPreview, setRoomPhotoPreview] = useState<string | null>(null);
  const creditBalance = 12;

  const [iterations] = useState<TIteration[]>(
    isNew
      ? []
      : [
          {
            id: "orig",
            label: t("workspace.original"),
            isOriginal: true,
          },
          {
            id: "it1",
            label: `${t("workspace.iteration")} 1`,
            isOriginal: false,
          },
          {
            id: "it2",
            label: `${t("workspace.iteration")} 2`,
            isOriginal: false,
          },
          {
            id: "it3",
            label: `${t("workspace.iteration")} 3`,
            isOriginal: false,
          },
        ],
  );
  const [activeIteration, setActiveIteration] = useState(
    iterations.length > 0 ? iterations[iterations.length - 1]!.id : "",
  );

  const handleRoomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRoomPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasResult(true);
      setIsEditMode(true);
    }, 3000);
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
          onRoomPhotoRemove={() => setRoomPhotoPreview(null)}
          isGenerating={isGenerating}
          canGenerate={canGenerate}
          creditBalance={creditBalance}
          onGenerate={handleGenerate}
        />

        <WorkspacePreview
          isGenerating={isGenerating}
          hasResult={hasResult}
          iterations={iterations}
          activeIterationId={activeIteration}
          onSelectIteration={setActiveIteration}
        />
      </div>
    </div>
  );
};

"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Label } from "@repo/ui/core/label";
import { Textarea } from "@repo/ui/core/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/core/select";
import { ModeToggle } from "@/modules/workspace/components/ModeToggle";
import { PhotoUpload } from "@/modules/workspace/components/PhotoUpload";
import {
  WORKSPACE_STYLES,
  COLOR_PALETTES,
  ROOM_TYPES,
} from "@/modules/workspace/data/mock-workspace";
import type { TGenerationMode } from "../../types/workspace.types";

type TWorkspaceFormProps = {
  isEditMode: boolean;
  mode: TGenerationMode;
  onModeChange: (mode: TGenerationMode) => void;
  style: string;
  onStyleChange: (style: string) => void;
  palette: string;
  onPaletteChange: (palette: string) => void;
  roomType: string;
  onRoomTypeChange: (roomType: string) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  roomPhotoPreview: string | null;
  onRoomPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoomPhotoRemove: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
  creditBalance: number;
  onGenerate: () => void;
};

export const WorkspaceForm = (props: TWorkspaceFormProps) => {
  const {
    isEditMode,
    mode,
    onModeChange,
    style,
    onStyleChange,
    palette,
    onPaletteChange,
    roomType,
    onRoomTypeChange,
    prompt,
    onPromptChange,
    roomPhotoPreview,
    onRoomPhotoUpload,
    onRoomPhotoRemove,
    isGenerating,
    canGenerate,
    creditBalance,
    onGenerate,
  } = props;
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className="w-full space-y-5 lg:w-[400px] lg:shrink-0">
      <div className="rounded-xl border bg-card p-5 shadow-card">
        {!isEditMode && <ModeToggle mode={mode} onModeChange={onModeChange} />}

        <div className="space-y-4">
          {/* Room photo upload — only in creation + photo mode */}
          {!isEditMode && mode === "photo" && (
            <PhotoUpload
              preview={roomPhotoPreview}
              onUpload={onRoomPhotoUpload}
              onRemove={onRoomPhotoRemove}
            />
          )}

          {/* Style */}
          <div className="space-y-2">
            <Label>{t("workspace.style")} *</Label>
            <Select value={style} onValueChange={onStyleChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("workspace.stylePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {WORKSPACE_STYLES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`styles.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color palette */}
          <div className="space-y-2">
            <Label>{t("workspace.colorPalette")}</Label>
            <Select value={palette} onValueChange={onPaletteChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("workspace.colorPalettePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {COLOR_PALETTES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {t(`palettes.${p}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Room type */}
          <div className="space-y-2">
            <Label>{t("workspace.roomType")} *</Label>
            <Select value={roomType} onValueChange={onRoomTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("workspace.roomTypePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {t(`roomTypes.${r}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <Label>
              {isEditMode ? t("workspace.editPrompt") : t("workspace.prompt")}
              {!isEditMode && mode === "scratch" && " *"}
            </Label>
            <Textarea
              placeholder={
                isEditMode ? t("workspace.editPromptPlaceholder") : t("workspace.promptPlaceholder")
              }
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              maxLength={1000}
              rows={3}
            />
          </div>

          {/* Furniture photos */}
          <div className="space-y-2">
            <Label>{t("workspace.furniturePhotos")}</Label>
            <label className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary hover:bg-accent/50">
              <Upload className="mb-1 h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {t("workspace.furniturePhotosHint")}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp,.avif,.heic"
                multiple
              />
            </label>
          </div>

          {/* Generate button */}
          {creditBalance < 1 ? (
            <div className="rounded-lg bg-accent p-3 text-center text-sm">
              <p className="mb-2 text-accent-foreground">{t("workspace.noCredits")}</p>
              <Button
                size="sm"
                onClick={() => router.push("/credits")}
                className="gradient-warm text-primary-foreground border-0"
              >
                {t("workspace.buyCredits")}
              </Button>
            </div>
          ) : (
            <Button
              onClick={onGenerate}
              disabled={!canGenerate || isGenerating}
              className="w-full gradient-warm text-primary-foreground border-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("workspace.generating")}
                </>
              ) : (
                t("workspace.generate")
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

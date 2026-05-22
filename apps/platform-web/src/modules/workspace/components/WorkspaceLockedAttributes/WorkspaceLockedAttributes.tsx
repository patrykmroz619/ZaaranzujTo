"use client";

import { useTranslations } from "next-intl";
import { ExpandableImage } from "@repo/ui/components/ExpandableImage";
import { useAssetUrl } from "@/modules/storage/hooks/use-asset-url";

type TWorkspaceVisualizationAttributesProps = {
  stylePreset: string;
  palette: string;
  roomType: string;
  originalPhotoAssetId?: string | null;
};

export const WorkspaceVisualizationAttributes = (props: TWorkspaceVisualizationAttributesProps) => {
  const { stylePreset, palette, roomType, originalPhotoAssetId } = props;
  const t = useTranslations();
  const { url: originalPhotoUrl } = useAssetUrl(originalPhotoAssetId);

  return (
    <div className="space-y-3 rounded-lg bg-muted/50 p-3 text-sm">
      <p className="text-xs font-medium text-foreground">{t("workspace.chosenAttributes")}</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{t("workspace.style")}</span>
          <span className="text-xs">{t(`styles.${stylePreset}` as never)}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{t("workspace.colorPalette")}</span>
          <span className="text-xs">{t(`palettes.${palette}` as never)}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{t("workspace.roomType")}</span>
          <span className="text-xs">{t(`roomTypes.${roomType}` as never)}</span>
        </div>
        {originalPhotoUrl && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">{t("workspace.roomPhoto")}</span>
            <ExpandableImage src={originalPhotoUrl} alt={t("workspace.original")} className="w-20" />
          </div>
        )}
      </div>
    </div>
  );
};

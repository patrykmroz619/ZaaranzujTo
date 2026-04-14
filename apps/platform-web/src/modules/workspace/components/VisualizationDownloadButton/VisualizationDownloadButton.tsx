"use client";

import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { storageApi } from "@/modules/storage/api/storage.api";

type TVisualizationDownloadButtonProps = {
  assetId: string;
  iterationId: string;
};

export const VisualizationDownloadButton = (props: TVisualizationDownloadButtonProps) => {
  const { assetId, iterationId } = props;
  const t = useTranslations("workspace");

  const handleDownload = async () => {
    try {
      const blob = await storageApi.downloadAsset({ assetId });
      if (!blob) return;
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `wizualizacja-${iterationId}.${blob.type.split("/")[1] ?? "png"}`;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Error downloading visualization:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDownload}
      className="absolute top-2 right-2 bg-background/70 hover:bg-background/90 backdrop-blur-sm"
      aria-label={t("downloadVisualization")}
    >
      <Download className="h-4 w-4" />
    </Button>
  );
};

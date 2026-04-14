"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Upload, X } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Label } from "@repo/ui/core/label";

type TFurniturePhotosFieldProps = {
  value: File[];
  onChange: (files: File[]) => void;
};

export const FurniturePhotosField = (props: TFurniturePhotosFieldProps) => {
  const { value, onChange } = props;
  const t = useTranslations();

  const previews = useMemo(() => value.map((file) => URL.createObjectURL(file)), [value]);

  useEffect(() => {
    return () => {
      previews.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, [previews]);

  return (
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
          accept=".jpg,.jpeg,.png,.webp,.avif"
          multiple
          onChange={(event) => {
            const uploadedFiles = Array.from(event.target.files ?? []);
            if (uploadedFiles.length === 0) return;
            onChange([...value, ...uploadedFiles]);
            event.target.value = "";
          }}
        />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {previews.map((previewUrl, index) => (
            <div key={`${previewUrl}-${index}`} className="relative">
              <img
                src={previewUrl}
                alt={`${t("workspace.furniturePhotoAlt")} ${index + 1}`}
                className="h-16 w-full rounded-md object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-1 top-1 h-5 w-5"
                onClick={() => {
                  onChange(value.filter((_, fileIndex) => fileIndex !== index));
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

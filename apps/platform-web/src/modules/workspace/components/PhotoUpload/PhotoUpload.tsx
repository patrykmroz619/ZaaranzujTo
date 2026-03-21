"use client";

import { useTranslations } from "next-intl";
import { Upload, X } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Label } from "@repo/ui/core/label";

type TPhotoUploadProps = {
  preview: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
};

const ACCEPTED_FORMATS = ".jpg,.jpeg,.png,.webp,.avif,.heic";

export const PhotoUpload = (props: TPhotoUploadProps) => {
  const { preview, onUpload, onRemove } = props;
  const t = useTranslations("workspace");

  return (
    <div className="space-y-2">
      <Label>{t("roomPhoto")} *</Label>
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Room" className="h-40 w-full rounded-lg object-cover" />
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-2 h-7 w-7"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary hover:bg-accent/50">
          <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{t("roomPhotoHint")}</span>
          <input type="file" className="hidden" accept={ACCEPTED_FORMATS} onChange={onUpload} />
        </label>
      )}
    </div>
  );
};

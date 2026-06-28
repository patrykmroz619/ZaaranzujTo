"use client";

import { useTranslations } from "next-intl";
import { Upload, X } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Label } from "@repo/ui/core/label";
import { toast } from "@repo/ui/core/sonner";

type TPhotoUploadProps = {
  preview: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
};

const ACCEPTED_FORMATS = ".jpg,.jpeg,.png,.webp,.avif,.heic";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const PhotoUpload = (props: TPhotoUploadProps) => {
  const { preview, onUpload, onRemove } = props;
  const t = useTranslations();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(t("errors.fileTooLarge"));
      return;
    }
    onUpload(file);
  };

  return (
    <div className="space-y-2">
      <Label>{t("workspace.roomPhoto")}</Label>
      <p className="text-xs text-muted-foreground">{t("workspace.roomPhotoOptional")}</p>
      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
          <span className="text-sm text-muted-foreground">{t("workspace.roomPhotoHint")}</span>
          <span className="mt-1 text-xs text-muted-foreground">
            {t("workspace.roomPhotoSizeHint")}
          </span>
          <input type="file" className="hidden" accept={ACCEPTED_FORMATS} onChange={handleChange} />
        </label>
      )}
    </div>
  );
};

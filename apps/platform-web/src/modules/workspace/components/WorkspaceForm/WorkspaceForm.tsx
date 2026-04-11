"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Loader2, X } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Input } from "@repo/ui/core/input";
import { Label } from "@repo/ui/core/label";
import { Textarea } from "@repo/ui/core/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/core/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/core/select";
import { PhotoUpload } from "@/modules/workspace/components/PhotoUpload";
import {
  WORKSPACE_STYLES,
  COLOR_PALETTES,
  ROOM_TYPES,
} from "@/modules/workspace/data/mock-workspace";
import {
  workspaceFormSchema,
  type TWorkspaceFormValues,
} from "../../types/workspace.types";

type TWorkspaceFormProps = {
  isEditMode: boolean;
  isGenerating: boolean;
  creditBalance: number;
  defaultValues: TWorkspaceFormValues;
  onSubmit: (values: TWorkspaceFormValues) => Promise<void>;
};

export const WorkspaceForm = (props: TWorkspaceFormProps) => {
  const { isEditMode, isGenerating, creditBalance, defaultValues, onSubmit } = props;
  const router = useRouter();
  const t = useTranslations();

  const form = useForm<TWorkspaceFormValues>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const roomPhotoFile = form.watch("roomPhotoFile");
  const furniturePhotoFiles = form.watch("furniturePhotoFiles");

  const roomPhotoPreview = useMemo(() => {
    if (!roomPhotoFile) return null;
    return URL.createObjectURL(roomPhotoFile);
  }, [roomPhotoFile]);

  const furniturePhotoPreviews = useMemo(() => {
    return furniturePhotoFiles.map((file) => URL.createObjectURL(file));
  }, [furniturePhotoFiles]);

  useEffect(() => {
    return () => {
      if (roomPhotoPreview) {
        URL.revokeObjectURL(roomPhotoPreview);
      }
    };
  }, [roomPhotoPreview]);

  useEffect(() => {
    return () => {
      furniturePhotoPreviews.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, [furniturePhotoPreviews]);

  return (
    <div className="w-full space-y-5 lg:w-[400px] lg:shrink-0">
      <div className="rounded-xl border bg-card p-5 shadow-card">
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("workspace.visualizationName")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("workspace.visualizationNamePlaceholder")}
                      value={field.value}
                      onChange={field.onChange}
                      maxLength={120}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditMode && (
              <PhotoUpload
                preview={roomPhotoPreview}
                onUpload={(event) => {
                  const nextFile = event.target.files?.[0] ?? null;
                  form.setValue("roomPhotoFile", nextFile, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                onRemove={() => {
                  form.setValue("roomPhotoFile", null, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
            )}

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("workspace.style")} *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("workspace.stylePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {WORKSPACE_STYLES.map((styleValue) => (
                          <SelectItem key={styleValue} value={styleValue}>
                            {t(`styles.${styleValue}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="palette"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("workspace.colorPalette")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("workspace.colorPalettePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {COLOR_PALETTES.map((paletteValue) => (
                          <SelectItem key={paletteValue} value={paletteValue}>
                            {t(`palettes.${paletteValue}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("workspace.roomType")} *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("workspace.roomTypePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {ROOM_TYPES.map((roomTypeValue) => (
                          <SelectItem key={roomTypeValue} value={roomTypeValue}>
                            {t(`roomTypes.${roomTypeValue}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditMode ? t("workspace.editPrompt") : t("workspace.prompt")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        isEditMode
                          ? t("workspace.editPromptPlaceholder")
                          : t("workspace.promptPlaceholder")
                      }
                      value={field.value}
                      onChange={field.onChange}
                      maxLength={1000}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

                    const currentFiles = form.getValues("furniturePhotoFiles");
                    form.setValue("furniturePhotoFiles", [...currentFiles, ...uploadedFiles], {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    event.target.value = "";
                  }}
                />
              </label>

              {furniturePhotoPreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {furniturePhotoPreviews.map((previewUrl, index) => (
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
                          const nextFiles = form
                            .getValues("furniturePhotoFiles")
                            .filter((_, fileIndex) => fileIndex !== index);
                          form.setValue("furniturePhotoFiles", nextFiles, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {creditBalance < 1 ? (
              <div className="rounded-lg bg-accent p-3 text-center text-sm">
                <p className="mb-2 text-accent-foreground">{t("workspace.noCredits")}</p>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => router.push("/credits")}
                  className="gradient-warm text-primary-foreground border-0"
                >
                  {t("workspace.buyCredits")}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={!form.formState.isValid || isGenerating}
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
        </Form>
      </div>
    </div>
  );
};

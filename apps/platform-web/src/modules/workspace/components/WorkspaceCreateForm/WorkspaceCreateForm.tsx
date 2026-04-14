"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Input } from "@repo/ui/core/input";
import { Textarea } from "@repo/ui/core/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/core/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/core/select";
import { PhotoUpload } from "@/modules/workspace/components/PhotoUpload";
import { FurniturePhotosField } from "@/modules/workspace/components/FurniturePhotosField";
import {
  WORKSPACE_STYLES,
  COLOR_PALETTES,
  ROOM_TYPES,
} from "@/modules/workspace/data/mock-workspace";
import {
  workspaceCreateSchema,
  type TWorkspaceCreateValues,
} from "../../types/workspace.types";

type TWorkspaceCreateFormProps = {
  isGenerating: boolean;
  creditBalance: number;
  onSubmit: (values: TWorkspaceCreateValues) => Promise<void>;
};

export const WorkspaceCreateForm = (props: TWorkspaceCreateFormProps) => {
  const { isGenerating, creditBalance, onSubmit } = props;
  const router = useRouter();
  const t = useTranslations();

  const form = useForm<TWorkspaceCreateValues>({
    resolver: zodResolver(workspaceCreateSchema),
    defaultValues: {
      name: "",
      stylePreset: "",
      palette: "",
      roomType: "",
      prompt: "",
      roomPhotoFile: undefined as unknown as File,
      furniturePhotoFiles: [],
    },
    mode: "onChange",
  });

  const roomPhotoFile = form.watch("roomPhotoFile");
  const furniturePhotoFiles = form.watch("furniturePhotoFiles");

  const roomPhotoPreview = useMemo(() => {
    if (!roomPhotoFile) return null;
    return URL.createObjectURL(roomPhotoFile);
  }, [roomPhotoFile]);

  useEffect(() => {
    return () => {
      if (roomPhotoPreview) URL.revokeObjectURL(roomPhotoPreview);
    };
  }, [roomPhotoPreview]);

  return (
    <div className="mx-auto w-full max-w-2xl">
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

            <PhotoUpload
              preview={roomPhotoPreview}
              onUpload={(event) => {
                const nextFile = event.target.files?.[0];
                if (!nextFile) return;
                form.setValue("roomPhotoFile", nextFile, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              onRemove={() => {
                form.setValue(
                  "roomPhotoFile",
                  undefined as unknown as File,
                  { shouldDirty: true, shouldValidate: true },
                );
              }}
            />

            <FormField
              control={form.control}
              name="stylePreset"
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
                  <FormLabel>{t("workspace.colorPalette")} *</FormLabel>
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
                  <FormLabel>{t("workspace.prompt")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("workspace.promptPlaceholder")}
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

            <FurniturePhotosField
              value={furniturePhotoFiles}
              onChange={(files) =>
                form.setValue("furniturePhotoFiles", files, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />

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

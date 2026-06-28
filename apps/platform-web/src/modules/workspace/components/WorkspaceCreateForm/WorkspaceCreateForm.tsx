"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch, type Control, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Input } from "@repo/ui/core/input";
import { CharCounter } from "@repo/ui/core/input-with-counter";
import { Textarea } from "@repo/ui/core/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/core/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/core/select";
import {
  OTHER_PRESET,
  STYLE_PRESETS,
  COLOR_PALETTE_PRESETS,
  ROOM_TYPE_PRESETS,
} from "@repo/contracts";
import { PhotoUpload } from "@/modules/workspace/components/PhotoUpload";
import { InspirationPhotoField } from "@/modules/workspace/components/InspirationPhotoField";
import { FurniturePhotosField } from "@/modules/workspace/components/FurniturePhotosField";
import { NoCreditsBanner } from "@/modules/workspace/components/NoCreditsBanner";
import { workspaceCreateSchema, type TWorkspaceCreateValues } from "../../types/workspace.types";

type TPresetSelectWithOtherProps = {
  control: Control<TWorkspaceCreateValues>;
  name: Path<TWorkspaceCreateValues>;
  customName: Path<TWorkspaceCreateValues>;
  label: string;
  placeholder: string;
  customPlaceholder: string;
  options: readonly string[];
  optionLabel: (key: string) => string;
  setValue: (name: Path<TWorkspaceCreateValues>, value: string, opts: object) => void;
};

const PresetSelectWithOther = (props: TPresetSelectWithOtherProps) => {
  const {
    control,
    name,
    customName,
    label,
    placeholder,
    customPlaceholder,
    options,
    optionLabel,
    setValue,
  } = props;

  const selectedValue = useWatch({ control, name });
  const showCustomInput = selectedValue === OTHER_PRESET;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label} *</FormLabel>
          <FormControl>
            <Select
              value={field.value as string}
              onValueChange={(value) => {
                field.onChange(value);
                if (value !== OTHER_PRESET) {
                  setValue(customName, "", { shouldValidate: true });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((optionValue) => (
                  <SelectItem key={optionValue} value={optionValue}>
                    {optionLabel(optionValue)}
                  </SelectItem>
                ))}
                <SelectItem value={OTHER_PRESET}>{optionLabel(OTHER_PRESET)}</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
          {showCustomInput && (
            <FormField
              control={control}
              name={customName}
              render={({ field: customField }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={customPlaceholder}
                      value={(customField.value as string) ?? ""}
                      onChange={customField.onChange}
                      maxLength={120}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </FormItem>
      )}
    />
  );
};

type TWorkspaceCreateFormProps = {
  isGenerating: boolean;
  creditBalance: number;
  onSubmit: (values: TWorkspaceCreateValues) => Promise<void>;
};

export const WorkspaceCreateForm = (props: TWorkspaceCreateFormProps) => {
  const { isGenerating, creditBalance, onSubmit } = props;
  const t = useTranslations();

  const form = useForm<TWorkspaceCreateValues>({
    resolver: zodResolver(workspaceCreateSchema),
    defaultValues: {
      name: "",
      stylePreset: "" as TWorkspaceCreateValues["stylePreset"],
      stylePresetCustom: "",
      palette: "" as TWorkspaceCreateValues["palette"],
      paletteCustom: "",
      roomType: "" as TWorkspaceCreateValues["roomType"],
      roomTypeCustom: "",
      prompt: "",
      roomPhotoFile: undefined,
      furniturePhotoFiles: [],
      inspirationPhotoFile: undefined,
    },
    mode: "all",
  });

  // TODO: React Compiler cannot memoize React Hook Form's watch() API safely. Consider refactoring to avoid direct watch() calls in the component when better support is available.
  /* eslint-disable react-hooks/incompatible-library */
  const roomPhotoFile = form.watch("roomPhotoFile");
  const furniturePhotoFiles = form.watch("furniturePhotoFiles");
  const inspirationPhotoFile = form.watch("inspirationPhotoFile");
  /* eslint-enable react-hooks/incompatible-library */

  const roomPhotoPreview = useMemo(() => {
    if (!roomPhotoFile) return null;
    return URL.createObjectURL(roomPhotoFile);
  }, [roomPhotoFile]);

  const inspirationPhotoPreview = useMemo(() => {
    if (!inspirationPhotoFile) return null;
    return URL.createObjectURL(inspirationPhotoFile);
  }, [inspirationPhotoFile]);

  useEffect(() => {
    return () => {
      if (roomPhotoPreview) URL.revokeObjectURL(roomPhotoPreview);
    };
  }, [roomPhotoPreview]);

  useEffect(() => {
    return () => {
      if (inspirationPhotoPreview) URL.revokeObjectURL(inspirationPhotoPreview);
    };
  }, [inspirationPhotoPreview]);

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
                      aria-required
                    />
                  </FormControl>
                  <div className="flex items-center justify-between gap-2">
                    <FormMessage />
                    <CharCounter current={field.value.length} max={120} />
                  </div>
                </FormItem>
              )}
            />

            <PhotoUpload
              preview={roomPhotoPreview}
              onUpload={(file) => {
                form.setValue("roomPhotoFile", file, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              onRemove={() => {
                form.setValue("roomPhotoFile", undefined, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />

            <PresetSelectWithOther
              control={form.control}
              name="stylePreset"
              customName="stylePresetCustom"
              label={t("workspace.style")}
              placeholder={t("workspace.stylePlaceholder")}
              customPlaceholder={t("workspace.customStylePlaceholder")}
              options={STYLE_PRESETS}
              optionLabel={(key) => t(`styles.${key}` as Parameters<typeof t>[0])}
              setValue={form.setValue}
            />

            <PresetSelectWithOther
              control={form.control}
              name="palette"
              customName="paletteCustom"
              label={t("workspace.colorPalette")}
              placeholder={t("workspace.colorPalettePlaceholder")}
              customPlaceholder={t("workspace.customPalettePlaceholder")}
              options={COLOR_PALETTE_PRESETS}
              optionLabel={(key) => t(`palettes.${key}` as Parameters<typeof t>[0])}
              setValue={form.setValue}
            />

            <PresetSelectWithOther
              control={form.control}
              name="roomType"
              customName="roomTypeCustom"
              label={t("workspace.roomType")}
              placeholder={t("workspace.roomTypePlaceholder")}
              customPlaceholder={t("workspace.customRoomTypePlaceholder")}
              options={ROOM_TYPE_PRESETS}
              optionLabel={(key) => t(`roomTypes.${key}` as Parameters<typeof t>[0])}
              setValue={form.setValue}
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

            <InspirationPhotoField
              preview={inspirationPhotoPreview}
              onUpload={(file) =>
                form.setValue("inspirationPhotoFile", file, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              onRemove={() =>
                form.setValue("inspirationPhotoFile", undefined, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
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
              <NoCreditsBanner />
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

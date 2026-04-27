"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Textarea } from "@repo/ui/core/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/core/form";
import { FurniturePhotosField } from "@/modules/workspace/components/FurniturePhotosField";
import { NoCreditsBanner } from "@/modules/workspace/components/NoCreditsBanner";
import { WorkspaceVisualizationAttributes } from "@/modules/workspace/components/WorkspaceLockedAttributes";
import {
  workspaceIterationSchema,
  type TWorkspaceIterationValues,
} from "../../types/workspace.types";

type TVisualizationAttributes = {
  stylePreset: string;
  palette: string;
  roomType: string;
  originalPhotoAssetId?: string | null;
};

type TWorkspaceIterationFormProps = {
  visualizationAttributes: TVisualizationAttributes;
  isGenerating: boolean;
  creditBalance: number;
  onSubmit: (values: TWorkspaceIterationValues) => Promise<void>;
};

export const WorkspaceIterationForm = (props: TWorkspaceIterationFormProps) => {
  const { visualizationAttributes, isGenerating, creditBalance, onSubmit } = props;
  const t = useTranslations();

  const form = useForm<TWorkspaceIterationValues>({
    resolver: zodResolver(workspaceIterationSchema),
    defaultValues: {
      prompt: "",
      furniturePhotoFiles: [],
    },
    mode: "onChange",
  });

  const furniturePhotoFiles = form.watch("furniturePhotoFiles");

  return (
    <div className="w-full space-y-5 lg:w-100 lg:shrink-0">
      <div className="rounded-xl border bg-card p-5 shadow-card">
        <Form {...form}>
          <div className="space-y-4">
            <WorkspaceVisualizationAttributes
              stylePreset={visualizationAttributes.stylePreset}
              palette={visualizationAttributes.palette}
              roomType={visualizationAttributes.roomType}
              originalPhotoAssetId={visualizationAttributes.originalPhotoAssetId}
            />

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("workspace.editPrompt")} *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("workspace.editPromptPlaceholder")}
                      value={field.value}
                      onChange={field.onChange}
                      maxLength={1000}
                      rows={4}
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
              <NoCreditsBanner />
            ) : (
              <Button
                type="button"
                onClick={form.handleSubmit(async (values) => {
                  await onSubmit(values);
                  form.reset({ prompt: "", furniturePhotoFiles: [] });
                })}
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

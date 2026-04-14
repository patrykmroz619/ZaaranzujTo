"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Textarea } from "@repo/ui/core/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/core/form";
import { FurniturePhotosField } from "@/modules/workspace/components/FurniturePhotosField";
import {
  workspaceIterationSchema,
  type TWorkspaceIterationValues,
} from "../../types/workspace.types";

type TLockedAttributes = {
  stylePreset: string;
  palette: string;
  roomType: string;
};

type TWorkspaceIterationFormProps = {
  lockedAttributes: TLockedAttributes;
  isGenerating: boolean;
  creditBalance: number;
  onSubmit: (values: TWorkspaceIterationValues) => Promise<void>;
};

export const WorkspaceIterationForm = (props: TWorkspaceIterationFormProps) => {
  const { lockedAttributes, isGenerating, creditBalance, onSubmit } = props;
  const router = useRouter();
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
            <div className="space-y-2 rounded-lg bg-muted/50 p-3 text-sm">
              <p className="text-xs text-muted-foreground">{t("workspace.lockedAttributesHint")}</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-background px-2.5 py-1 text-xs">
                  {t(`styles.${lockedAttributes.stylePreset}` as never)}
                </span>
                <span className="rounded-full bg-background px-2.5 py-1 text-xs">
                  {t(`palettes.${lockedAttributes.palette}` as never)}
                </span>
                <span className="rounded-full bg-background px-2.5 py-1 text-xs">
                  {t(`roomTypes.${lockedAttributes.roomType}` as never)}
                </span>
              </div>
            </div>

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

"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/core/tabs";
import type { TGenerationMode } from "../../types/workspace.types";

type TModeToggleProps = {
  mode: TGenerationMode;
  onModeChange: (mode: TGenerationMode) => void;
};

export const ModeToggle = (props: TModeToggleProps) => {
  const { mode, onModeChange } = props;
  const t = useTranslations("workspace");

  return (
    <div className="mb-5">
      <Tabs value={mode} onValueChange={(v) => onModeChange(v as TGenerationMode)}>
        <TabsList className="w-full">
          <TabsTrigger value="photo" className="flex-1">
            {t("modeFromPhoto")}
          </TabsTrigger>
          <TabsTrigger value="scratch" className="flex-1">
            {t("modeFromScratch")}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@repo/ui/components/page-header";
import { ThemeSelector } from "@/modules/settings/components/ThemeSelector";
import { AccountActions } from "@/modules/settings/components/AccountActions";

export const SettingsView = () => {
  const t = useTranslations("settings");

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ThemeSelector />
      <AccountActions />
    </div>
  );
};

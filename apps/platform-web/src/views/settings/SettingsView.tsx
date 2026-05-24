"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { PageHeader } from "@repo/ui/components/PageHeader";
import { ThemeSelector } from "@/modules/settings/components/ThemeSelector";
import { AccountSettings } from "@/modules/settings/components/AccountSettings";
import { useProfile } from "@/core/packages/profile/use-profile";

export const SettingsView = () => {
  const t = useTranslations("settings");
  const { profile } = useProfile();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (profile?.theme) {
      setTheme(profile.theme);
    }
  }, [profile?.theme, setTheme]);

  return (
    <div className="space-y-5">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ThemeSelector />
      <AccountSettings />
    </div>
  );
};

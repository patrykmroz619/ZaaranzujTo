"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@repo/ui/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/core/card";
import type { TTheme } from "@repo/contracts";
import { useUpdateProfile } from "@/modules/settings/hooks/use-update-profile";

export const ThemeSelector = () => {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const themeOptions: { value: TTheme; label: string }[] = [
    { value: "light", label: t("themeLight") },
    { value: "dark", label: t("themeDark") },
    { value: "system", label: t("themeSystem") },
  ];

  const handleThemeChange = (value: TTheme) => {
    setTheme(value);
    updateProfile({ body: { theme: value } });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-lg">{t("theme")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {themeOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={theme === opt.value ? "default" : "outline"}
              size="sm"
              disabled={isPending}
              onClick={() => handleThemeChange(opt.value)}
              className={theme === opt.value ? "gradient-warm text-primary-foreground border-0" : ""}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

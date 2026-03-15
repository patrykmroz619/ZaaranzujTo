import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { useTheme, type Theme } from "@/hooks/use-theme";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const themeOptions: { value: Theme; label: string }[] = [
    { value: "light", label: t("settings.themeLight") },
    { value: "dark", label: t("settings.themeDark") },
    { value: "system", label: t("settings.themeSystem") },
  ];

  return (
    <DashboardLayout subtitle="Konto" title={t("settings.title")}>
      <div className="p-4 md:p-6 lg:p-8 max-w-2xl space-y-5">
        <PageHeader
          title={t("settings.title")}
          subtitle="Zarządzaj swoim kontem i preferencjami."
        />
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">
              {t("settings.theme")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {themeOptions.map((opt) => (
                <Button
                  key={opt.value}
                  variant={theme === opt.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme(opt.value)}
                  className={
                    theme === opt.value
                      ? "gradient-warm text-primary-foreground border-0"
                      : ""
                  }
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">
              {t("settings.account")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <div>
              <Label className="text-sm text-muted-foreground">
                {t("settings.deleteAccount")}
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("settings.deleteAccountConfirm")}
              </p>
              <Button variant="destructive" size="sm" className="mt-3">
                {t("settings.deleteAccount")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

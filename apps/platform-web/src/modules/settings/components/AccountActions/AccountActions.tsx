"use client";

import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/core/card";
import { Label } from "@repo/ui/core/label";
import { Separator } from "@repo/ui/core/separator";

export const AccountActions = () => {
  const t = useTranslations("settings");

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-lg">{t("account")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />
        <div>
          <Label className="text-sm text-muted-foreground">{t("deleteAccount")}</Label>
          <p className="mt-1 text-xs text-muted-foreground">{t("deleteAccountConfirm")}</p>
          <Button variant="destructive" size="sm" className="mt-3">
            {t("deleteAccount")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

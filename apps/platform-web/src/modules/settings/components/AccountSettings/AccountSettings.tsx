"use client";

import { useClerk } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/core/card";

export const AccountSettings = () => {
  const t = useTranslations("settings");
  const { openUserProfile } = useClerk();

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-lg">{t("account")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-5 text-sm text-muted-foreground">{t("accountSubtitle")}</p>
        <Button size="sm" onClick={() => openUserProfile()}>
          {t("manageAccount")}
        </Button>
      </CardContent>
    </Card>
  );
};

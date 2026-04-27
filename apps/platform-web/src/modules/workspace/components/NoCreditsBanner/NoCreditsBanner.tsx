"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";
import { Button } from "@repo/ui/core/button";

export const NoCreditsBanner = () => {
  const router = useRouter();
  const t = useTranslations("workspace");

  return (
    <div className="rounded-lg border border-warning/40 bg-warning/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <div className="flex-1 space-y-1">
          <p className="font-medium text-foreground">{t("requiresCredit")}</p>
          <p className="text-sm text-muted-foreground">{t("noCredits")}</p>
        </div>
      </div>
      <Button
        type="button"
        onClick={() => router.push("/credits")}
        className="mt-3 w-full gradient-warm border-0 text-primary-foreground"
      >
        {t("buyCredits")}
      </Button>
    </div>
  );
};

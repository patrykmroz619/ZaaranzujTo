"use client";

import { useTranslations } from "next-intl";
import { Wallet } from "lucide-react";
import { Card, CardContent } from "@repo/ui/core/card";
import { Skeleton } from "@repo/ui/core/skeleton";
import { PageHeader } from "@repo/ui/components/PageHeader";
import { CreditPackageCard } from "@/modules/credits/components/CreditPackageCard";
import { CreditPackageCardSkeleton } from "@/modules/credits/components/CreditPackageCardSkeleton";
import { useCreditPackages } from "@/modules/credits/hooks/use-credit-packages";
import { useProfile } from "@/core/packages/profile/use-profile";

export const CreditsView = () => {
  const t = useTranslations("credits");
  const { packages, isLoading, error } = useCreditPackages();
  const { profile, isLoading: isLoadingProfile } = useProfile();

  const activePackages = (packages?.items ?? []).filter((pkg) => pkg.isActive);
  const balance = profile?.creditBalance ?? 0;

  const handleBuy = (_packageCode: string) => {
    // Payment integration is out of scope for this feature
  };

  return (
    <div className="space-y-5">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <Card className="mx-auto max-w-3xl shadow-card">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
            <Wallet className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("yourBalance")}
            </p>
            {isLoadingProfile ? (
              <Skeleton className="mt-1 h-7 w-24" />
            ) : (
              <p className="font-display text-2xl text-foreground">
                {balance} {t("balance")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="mx-auto max-w-3xl text-sm text-muted-foreground">{t("creditsPerGeneration")}</p>

      {isLoading ? (
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CreditPackageCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex justify-center py-20">
          <p className="text-muted-foreground">{t("purchaseError")}</p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
          {activePackages.map((pkg) => (
            <CreditPackageCard key={pkg.packageCode} creditPackage={pkg} onBuy={handleBuy} />
          ))}
        </div>
      )}
    </div>
  );
};

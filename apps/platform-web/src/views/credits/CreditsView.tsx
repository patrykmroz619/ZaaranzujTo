"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@repo/ui/components/page-header";
import { CreditPackageCard } from "@/modules/credits/components/CreditPackageCard";
import { useCreditPackages } from "@/modules/credits/hooks/use-credit-packages";

export const CreditsView = () => {
  const t = useTranslations("credits");
  const { packages, isLoading, error } = useCreditPackages();

  const activePackages = (packages?.items ?? []).filter((pkg) => pkg.isActive);

  const handleBuy = (_packageCode: string) => {
    // Payment integration is out of scope for this feature
  };

  return (
    <div className="space-y-5">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {isLoading ? (
        <div className="flex justify-center py-20">
          <p className="text-muted-foreground">{t("balance")}</p>
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

"use client";

import { useTranslations } from "next-intl";
import { toast } from "@repo/ui/core/sonner";
import { PageHeader } from "@repo/ui/components/page-header";
import { CreditPackageCard } from "@/modules/credits/components/CreditPackageCard";
import { MOCK_CREDIT_PACKAGES } from "@/modules/credits/data/mock-credits";

export const CreditsView = () => {
  const t = useTranslations("credits");

  const handleBuy = (_packageId: string) => {
    toast.success(t("purchaseSuccess"));
  };

  return (
    <div className="space-y-5">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
        {MOCK_CREDIT_PACKAGES.map((pkg) => (
          <CreditPackageCard key={pkg.id} creditPackage={pkg} onBuy={handleBuy} />
        ))}
      </div>
    </div>
  );
};

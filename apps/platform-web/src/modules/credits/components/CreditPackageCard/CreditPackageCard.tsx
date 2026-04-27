import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/core/button";
import { Card, CardContent } from "@repo/ui/core/card";
import type { TCreditPackage } from "@repo/contracts";

type TCreditPackageCardProps = {
  creditPackage: TCreditPackage;
  onBuy: (packageCode: string) => void;
};

export const CreditPackageCard = (props: TCreditPackageCardProps) => {
  const { creditPackage, onBuy } = props;
  const t = useTranslations("credits");

  return (
    <Card className="relative transition-shadow hover:shadow-elevated">
      <CardContent className="flex flex-col items-center p-6 pt-8">
        <h3 className="font-display text-xl text-card-foreground">{creditPackage.name}</h3>
        <div className="my-4 text-center">
          <span className="text-4xl font-bold text-foreground">{creditPackage.credits}</span>
          <p className="text-sm text-muted-foreground">{t("packageCredits")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("approxVisualizations", { count: creditPackage.credits })}
          </p>
        </div>
        <p className="mb-4 text-2xl font-semibold text-foreground">
          {creditPackage.price.amount} {creditPackage.price.currency}
        </p>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => onBuy(creditPackage.packageCode)}
        >
          {t("buy")}
        </Button>
      </CardContent>
    </Card>
  );
};

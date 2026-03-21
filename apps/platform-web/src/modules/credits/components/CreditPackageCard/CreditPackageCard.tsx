import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Card, CardContent } from "@repo/ui/core/card";
import type { TCreditPackage } from "../../types/credits.types";

type TCreditPackageCardProps = {
  creditPackage: TCreditPackage;
  onBuy: (id: string) => void;
};

export const CreditPackageCard = (props: TCreditPackageCardProps) => {
  const { creditPackage, onBuy } = props;
  const t = useTranslations("credits");

  return (
    <Card
      className={`relative transition-shadow hover:shadow-elevated ${
        creditPackage.isPopular ? "border-primary shadow-elevated" : ""
      }`}
    >
      {creditPackage.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full gradient-warm px-3 py-1 text-xs font-medium text-primary-foreground">
          <Star className="h-3 w-3" />
          {t("popular")}
        </div>
      )}
      <CardContent className="flex flex-col items-center p-6 pt-8">
        <h3 className="font-display text-xl text-card-foreground">{creditPackage.name}</h3>
        <div className="my-4 text-center">
          <span className="text-4xl font-bold text-foreground">{creditPackage.credits}</span>
          <p className="text-sm text-muted-foreground">{t("packageCredits")}</p>
        </div>
        <p className="mb-4 text-2xl font-semibold text-foreground">{creditPackage.price} PLN</p>
        <Button
          className={`w-full ${
            creditPackage.isPopular ? "gradient-warm text-primary-foreground border-0" : ""
          }`}
          variant={creditPackage.isPopular ? "default" : "outline"}
          onClick={() => onBuy(creditPackage.id)}
        >
          {t("buy")}
        </Button>
      </CardContent>
    </Card>
  );
};

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
}

const packages: CreditPackage[] = [
  { id: "starter", name: "Starter", credits: 10, price: 19.99 },
  {
    id: "standard",
    name: "Standard",
    credits: 30,
    price: 49.99,
    popular: true,
  },
  { id: "pro", name: "Pro", credits: 100, price: 129.99 },
];

export default function CreditsPage() {
  const { t } = useTranslation();

  return (
    <DashboardLayout subtitle="Płatności" title={t("credits.title")}>
      <div className="p-4 md:p-6 lg:p-8 space-y-5">
        <PageHeader title={t("credits.title")} subtitle={t("credits.subtitle")} />
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={`relative transition-shadow hover:shadow-elevated ${pkg.popular ? "border-primary shadow-elevated" : ""}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full gradient-warm px-3 py-1 text-xs font-medium text-primary-foreground">
                    <Star className="h-3 w-3" />
                    {t("credits.popular")}
                  </div>
                )}
                <CardContent className="flex flex-col items-center p-6 pt-8">
                  <h3 className="font-display text-xl text-card-foreground">{pkg.name}</h3>
                  <div className="my-4 text-center">
                    <span className="text-4xl font-bold text-foreground">{pkg.credits}</span>
                    <p className="text-sm text-muted-foreground">{t("credits.packageCredits")}</p>
                  </div>
                  <p className="mb-4 text-2xl font-semibold text-foreground">{pkg.price} PLN</p>
                  <Button
                    className={`w-full ${pkg.popular ? "gradient-warm text-primary-foreground border-0" : ""}`}
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    {t("credits.buy")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

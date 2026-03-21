import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Sparkles, Palette, RefreshCw } from "lucide-react";
import { Button } from "@repo/ui/core/button";

const features = [
  { icon: Sparkles, titleKey: "feature1Title" as const, descKey: "feature1Desc" as const },
  { icon: Palette, titleKey: "feature2Title" as const, descKey: "feature2Desc" as const },
  { icon: RefreshCw, titleKey: "feature3Title" as const, descKey: "feature3Desc" as const },
];

export const LandingView = async () => {
  const t = await getTranslations();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container relative z-10 flex flex-col items-center gap-8 py-20 text-center lg:py-32">
          <h1 className="max-w-3xl text-4xl font-display tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("app.tagline")}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">{t("landing.heroSubtitle")}</p>
          <div className="flex gap-3">
            <Button
              size="lg"
              asChild
              className="gradient-warm text-primary-foreground border-0 gap-2"
            >
              <Link href="/sign-up">
                {t("nav.register")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">{t("nav.signIn")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-display text-foreground">
            {t("landing.howItWorks")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                    <Icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="mb-2 font-display text-xl text-card-foreground">
                    {t(`landing.${f.titleKey}`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`landing.${f.descKey}`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

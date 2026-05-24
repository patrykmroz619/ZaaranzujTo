"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/core/button";

const NotFound = () => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className="container flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="font-display text-4xl text-foreground">{t("notFound.title")}</h1>
      <p className="text-muted-foreground">{t("notFound.message")}</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" onClick={() => router.back()}>
          {t("errors.goBack")}
        </Button>
        <Button asChild>
          <Link href="/">{t("notFound.backHome")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

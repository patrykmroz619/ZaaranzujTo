import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@repo/ui/core/button";

const NotFound = async () => {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl text-foreground mb-4">{t("title")}</h1>
        <p className="text-muted-foreground mb-6">{t("message")}</p>
        <Button asChild>
          <Link href="/">{t("backHome")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

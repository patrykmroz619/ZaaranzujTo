"use client";

import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="border-t bg-muted/30">
      <div className="container flex flex-col items-center justify-between gap-2 py-6 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ZaaranżujTo
        </p>
        <div className="flex gap-4">
          <a
            href="mailto:kontakt@zaaranzujto.pl"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("contact")}
          </a>
          <a
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("terms")}
          </a>
        </div>
      </div>
    </footer>
  );
};

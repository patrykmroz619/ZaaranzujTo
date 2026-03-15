import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

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
            {t("footer.contact")}
          </a>
          <a
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.terms")}
          </a>
        </div>
      </div>
    </footer>
  );
}

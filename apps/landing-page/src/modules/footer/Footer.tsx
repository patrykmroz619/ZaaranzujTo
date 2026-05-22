import { BrandLogo } from "@repo/ui/components/BrandLogo";

export const Footer = () => (
  <footer className="py-12 border-t border-border text-sm text-muted-foreground">
    <div className="container">
      <div className="flex flex-wrap gap-6 items-center justify-between">
        <a
          href="#top"
          className="inline-flex outline-none rounded-md focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BrandLogo className="text-[18px]" />
        </a>

        <nav className="flex gap-5.5 flex-wrap">
          <a
            href="mailto:kontakt@zaaranzujto.pl"
            className="hover:text-foreground transition-colors"
          >
            kontakt@zaaranzujto.pl
          </a>
          <a href="#regulamin" className="hover:text-foreground transition-colors">
            Regulamin
          </a>
          <a href="#prywatnosc" className="hover:text-foreground transition-colors">
            Polityka prywatności
          </a>
          <a href="#login" className="hover:text-foreground transition-colors">
            Zaloguj się
          </a>
        </nav>

        <span className="text-[13px]">© 2026 ZaaranżujTo</span>
      </div>
    </div>
  </footer>
);

export const Footer = () => (
  <footer className="py-12 border-t border-border text-sm text-muted-foreground">
    <div className="container">
      <div className="flex flex-wrap gap-6 items-center justify-between">
        <a
          href="#top"
          className="inline-flex items-center gap-2.5 tracking-[-0.015em] text-foreground font-display text-[18px]"
        >
          <span
            className="relative w-7 h-7 rounded-xl bg-primary shrink-0 shadow-icon-inset"
            aria-hidden="true"
          >
            <span className="absolute inset-1.5 border-2 border-primary-foreground border-b-0 border-r-0 rounded-tl-lg" />
          </span>
          <span>ZaaranżujTo</span>
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

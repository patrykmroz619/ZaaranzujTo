import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export const Nav = () => (
  <header className="sticky top-0 z-20 border-b bg-background/78 backdrop-blur-md backdrop-saturate-140 border-border/50">
    <div className="container relative flex items-center justify-between h-16">
      <a
        href="#top"
        className="inline-flex items-center gap-2.5 text-[20px] tracking-[-0.015em] font-display"
        aria-label="ZaaranżujTo"
      >
        <span
          className="relative w-7 h-7 rounded-xl bg-primary shrink-0 shadow-icon-inset"
          aria-hidden="true"
        >
          <span className="absolute inset-1.5 border-2 border-primary-foreground border-b-0 border-r-0 rounded-tl-lg" />
        </span>
        <span>ZaaranżujTo</span>
      </a>

      <nav className="hidden min-[761px]:flex items-center gap-7">
        <a
          href="#galeria"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Galeria
        </a>
        <a
          href="#jak"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Jak to działa
        </a>
        <a
          href="#cennik"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cennik
        </a>
        <div className="w-px h-4 bg-border" aria-hidden="true" />
        <ThemeToggle />
        <a
          href="#login"
          className="inline-flex items-center gap-2 py-2.25 px-4 rounded-full text-sm font-medium bg-foreground text-background border border-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-[background,color,border-color,transform,box-shadow] duration-150 hover:-translate-y-px"
        >
          Zaloguj się
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </nav>

      <div className="min-[761px]:hidden flex items-center gap-1">
        <ThemeToggle />
        <MobileMenu />
      </div>
    </div>
  </header>
);

import { lowestPriceLabel } from "@/lib/pricing";

export const FinalCtaSection = () => (
  <section id="start" className="gradient-hero py-24 max-[720px]:py-16 text-center">
    <div className="container">
      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
        Twój ruch
      </span>
      <h2 className="mt-3.5 text-foreground text-[clamp(40px,5.5vw,64px)]">
        Zaprojektuj swoje nowe mieszkanie
        <br className="hidden sm:block" />
        już dzisiaj.
      </h2>
      <p className="text-muted-foreground mt-4 text-[18px]">
        Pierwsza wizualizacja gotowa zanim skończysz kawę.
      </p>
      <a
        href="#"
        className="inline-flex items-center gap-2.5 mt-8 py-4.5 px-7 rounded-full font-medium text-[17px] bg-primary text-primary-foreground transition-[transform,box-shadow] duration-150 hover:-translate-y-px shadow-cta"
      >
        Zacznij od {lowestPriceLabel} PLN
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  </section>
);

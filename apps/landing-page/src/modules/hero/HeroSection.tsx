import { lowestPriceLabel } from "@/lib/pricing";

export const HeroSection = () => (
  <section id="top" className="gradient-hero overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16">
    <div className="container">
      <div className="grid items-center grid-cols-1 gap-10 lg:gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-5.5 bg-accent text-accent-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Twój osobisty projektant wnętrz
          </span>

          <h1 className="text-foreground text-[clamp(34px,4.4vw,56px)] tracking-[-0.022em]">
            Zaprojektuj idealne wnętrze z pomocą{" "}
            <em className="text-primary not-italic">sztucznej inteligecji</em>
          </h1>

          <p className="text-muted-foreground mt-6 text-[clamp(17px,1.4vw,19px)] max-w-135">
            Zobacz fotorealistyczne wizualizacje swojego salonu czy sypialni w zaledwie kilka minut.
            Sprawdź różne style, przetestuj pomysły i urządź mieszkanie dokładnie tak, jak marzysz –
            bez stresu i zgadywania
          </p>

          <div className="mt-9 flex items-center gap-4 flex-wrap max-[400px]:flex-col max-[400px]:items-start">
            <a
              href="#cennik"
              className="inline-flex items-center gap-2.5 py-4.5 px-7 rounded-full font-medium text-[17px] bg-primary text-primary-foreground transition-[transform,box-shadow] duration-150 hover:-translate-y-px shadow-cta"
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
            <a
              href="#galeria"
              className="inline-flex items-center gap-1.5 text-sm text-foreground pb-px border-b border-border hover:text-primary hover:border-primary transition-colors duration-150"
            >
              Zobacz przykłady
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="mt-7 flex gap-6 flex-wrap text-muted-foreground text-[13px]">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-success" />
              Wizualizacje w kilka minut
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-success" />
              Płatność BLIK
            </span>
          </div>
        </div>

        <div className="overflow-hidden shadow-elevated border border-border rounded-[calc(var(--radius)+4px)]">
          <img
            src="/hero-image.avif"
            alt="Wizualizacja wnętrza — salon, styl skandynawski"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

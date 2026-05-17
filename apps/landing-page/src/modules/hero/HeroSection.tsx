import { PlaceholderImage } from "@/components/PlaceholderImage";

export const HeroSection = () => (
  <section id="top" className="gradient-hero overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16">
    <div className="container">
      <div className="grid items-center gap-14 grid-cols-[1.05fr_1fr] max-[980px]:grid-cols-1 max-[980px]:gap-10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-5.5 bg-accent text-accent-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Dla osób urządzających nowe mieszkanie
          </span>

          <h1 className="text-foreground text-[clamp(34px,4.4vw,56px)] tracking-[-0.022em]">
            Zobacz, jak będzie wyglądać Twoje mieszkanie —{" "}
            <em className="text-primary not-italic">zanim</em> wydasz złotówkę na meble.
          </h1>

          <p className="text-muted-foreground mt-6 text-[clamp(17px,1.4vw,19px)] max-w-135">
            Realistyczne wizualizacje wnętrz w kilka minut. Bez projektanta za 5&nbsp;000&nbsp;PLN,
            bez weekendów na Pinterest, bez ryzyka kupna sofy która nie pasuje.
          </p>

          <div className="mt-9 flex items-center gap-4 flex-wrap max-[400px]:flex-col max-[400px]:items-start">
            <a
              href="#cennik"
              className="inline-flex items-center gap-2.5 py-4.5 px-7 rounded-full font-medium text-[17px] bg-primary text-primary-foreground transition-[transform,box-shadow] duration-150 hover:-translate-y-px shadow-cta"
            >
              Zacznij od 29 PLN
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
              Wizualizacja w &lt; 1 min
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-success" />6 stylów, 7 typów
              pomieszczeń
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-success" />
              Płatność BLIK
            </span>
          </div>
        </div>

        <div className="overflow-hidden shadow-elevated border border-border rounded-[calc(var(--radius)+4px)]">
          <PlaceholderImage
            label="Wizualizacja wnętrza — salon, styl skandynawski"
            aspectRatio="4/3"
          />
        </div>
      </div>
    </div>
  </section>
);

import type { TPricingPackage } from "./data";
import { PricingCard } from "./PricingCard";

type TProps = {
  data: TPricingPackage[];
};

export const PricingSection = ({ data }: TProps) => {
  return (
    <section id="cennik" className="py-24 max-[720px]:py-16">
      <div className="container">
        <div className="max-w-[720px] mx-auto mb-12 text-center">
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
            Cennik
          </span>
          <h2 className="mt-3.5 text-foreground text-[clamp(34px,5vw,52px)]">
            Płacisz tylko za wizualizacje, które generujesz
          </h2>
          <p className="mt-3.5 text-muted-foreground text-[17px]">
            Brak abonamentu. Brak ukrytych kosztów. Kredyty nie wygasają.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 max-[880px]:grid-cols-1 items-stretch">
          {data.map((pkg) => (
            <PricingCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <p className="text-center text-muted-foreground text-[13.5px] mt-7">
          <strong className="text-foreground font-medium">
            1 kredyt = 1 wygenerowana wizualizacja.
          </strong>{" "}
          Kredyty nie wygasają. Płatność BLIK, karta lub przelew.
        </p>
      </div>
    </section>
  );
};

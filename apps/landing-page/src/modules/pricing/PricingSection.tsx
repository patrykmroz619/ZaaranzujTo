import { CREDIT_PACKAGES } from "@repo/contracts/credits";
import { PricingCard } from "./PricingCard";

const packages = CREDIT_PACKAGES.filter((pkg) => pkg.isActive);
const maxPricePerCredit = Math.max(...packages.map((pkg) => pkg.price.amount / pkg.credits));

export const PricingSection = () => {
  return (
    <section id="cennik" className="py-24 max-[720px]:py-16">
      <div className="container">
        <div className="max-w-[720px] mx-auto mb-12 text-center">
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
            Cennik
          </span>
          <h2 className="mt-3.5 text-foreground text-[clamp(34px,5vw,52px)]">Pakiety kredytów</h2>
          <p className="mt-3.5 text-muted-foreground text-[17px]">
            Brak abonamentu. Płacisz tylko za wizualizacje, które generujesz.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 max-[880px]:grid-cols-1 items-stretch">
          {packages.map((pkg) => {
            const savingsPercent = Math.round(
              (1 - pkg.price.amount / pkg.credits / maxPricePerCredit) * 100,
            );
            return (
              <PricingCard key={pkg.packageCode} pkg={pkg} savingsPercent={savingsPercent} />
            );
          })}
        </div>

        <p className="text-center text-muted-foreground text-[13.5px] mt-7">
          <strong className="text-foreground font-medium">
            1 kredyt = 1 wygenerowana wizualizacja.
          </strong>{" "}
          Płatności obsługiwane przez ...
        </p>
      </div>
    </section>
  );
};

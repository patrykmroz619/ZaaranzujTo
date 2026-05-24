import type { TCreditPackage } from "@repo/contracts/credits";

type TProps = {
  pkg: TCreditPackage;
  savingsPercent: number;
};

export const PricingCard = ({ pkg, savingsPercent }: TProps) => {
  const perCredit = pkg.price.amount / pkg.credits;
  const isFeatured = pkg.isPopular;

  return (
    <div
      className={`relative flex flex-col gap-[14px] p-8 rounded-[var(--radius)] border bg-card ${
        isFeatured ? "border-primary shadow-elevated -translate-y-2" : "border-border"
      }`}
    >
      {isFeatured && (
        <span className="absolute top-[-14px] left-1/2 -translate-x-1/2 px-[14px] py-1.5 rounded-full text-[11px] font-semibold tracking-[0.06em] uppercase bg-primary text-primary-foreground">
          Najpopularniejszy
        </span>
      )}

      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
        Pakiet {pkg.name}
      </span>

      <div className="leading-none tracking-[-0.02em] font-display text-[48px]">
        {pkg.credits}
        <small className="ml-2 tracking-normal font-body text-[16px] text-muted-foreground">
          kredytów
        </small>
      </div>

      <div className="text-[17px] font-medium">{pkg.price.amount} PLN</div>

      <div className="flex items-center gap-2 text-muted-foreground text-[13px]">
        {perCredit.toFixed(2).replace(".", ",")} PLN&nbsp;/&nbsp;wizualizacja
        {savingsPercent > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-[0.02em] bg-accent text-accent-foreground">
            −{savingsPercent}%
          </span>
        )}
      </div>

      <div className="h-px bg-border my-1.5" />

      <div className="mt-auto pt-1">
        <a
          href="#start"
          className={`flex items-center justify-center w-full py-3.5 px-[22px] rounded-full font-medium text-[15px] border transition-[transform,box-shadow,background] duration-150 hover:-translate-y-px ${
            isFeatured
              ? "bg-primary text-primary-foreground border-transparent shadow-cta"
              : "bg-transparent text-foreground border-border"
          }`}
        >
          Zacznij od {pkg.price.amount} PLN
        </a>
      </div>
    </div>
  );
};

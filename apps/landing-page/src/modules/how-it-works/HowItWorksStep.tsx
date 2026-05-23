import { PlaceholderImage } from "@/components/PlaceholderImage";

type TProps = {
  stepNumber: string;
  title: string;
  description: string;
  slotLabel: string;
  reverse?: boolean;
  showAdvantage?: boolean;
};

export const HowItWorksStep = ({
  stepNumber,
  title,
  description,
  slotLabel,
  reverse = false,
  showAdvantage = false,
}: TProps) => (
  <div
    className={`grid items-center gap-14 max-[880px]:grid-cols-1 max-[880px]:gap-6 ${
      reverse ? "grid-cols-[1.2fr_1fr]" : "grid-cols-[1fr_1.2fr]"
    }`}
  >
    <div className={`flex flex-col gap-3.5 ${reverse ? "max-[880px]:order-1 order-2" : "order-1"}`}>
      <div className="leading-none tracking-[-0.04em] font-display text-[clamp(64px,6vw,80px)] text-primary">
        {stepNumber}
      </div>
      <h3 className="text-[clamp(32px,3vw,40px)] tracking-[-0.015em]">{title}</h3>
      <p className="text-muted-foreground max-w-115 text-[16.5px]">{description}</p>
      {showAdvantage && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium self-start mt-4.5 bg-accent text-accent-foreground">
          <span className="opacity-80">Zdjęcia pochodzą z panelu aplikacji ZaaranżujTo</span>
        </div>
      )}
    </div>

    <div
      className={`overflow-hidden border border-border shadow-elevated aspect-16/10 rounded-[calc(var(--radius)+4px)] ${
        reverse ? "max-[880px]:order-2 order-1" : "order-2"
      }`}
    >
      <PlaceholderImage label={slotLabel} aspectRatio="16/10" />
    </div>
  </div>
);

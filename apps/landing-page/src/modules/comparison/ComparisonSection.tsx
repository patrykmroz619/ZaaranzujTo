import type { TComparisonRow } from "./data";

type TProps = {
  data: TComparisonRow[];
};

const CellValue = ({
  value,
  muted,
  positive,
}: {
  value: string;
  muted?: boolean;
  positive?: boolean;
}) => (
  <span
    className={`${muted ? "font-normal" : "font-medium"} ${
      positive ? "text-success" : muted ? "text-muted-foreground" : ""
    }`}
  >
    {value}
  </span>
);

export const ComparisonSection = ({ data }: TProps) => (
  <section className="py-24 max-[720px]:py-16 bg-card">
    <div className="container">
      <div className="max-w-180 mx-auto mb-12 text-center">
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
          Porównanie
        </span>
        <h2 className="mt-3.5 text-foreground text-[clamp(34px,5vw,52px)]">
          Dlaczego nie projektant. Dlaczego nie Pinterest.
        </h2>
        <p className="mt-3.5 text-muted-foreground text-[17px]">
          Dwie alternatywy, które już znasz — i miejsce, w&nbsp;którym ZaaranżujTo wygrywa.
        </p>
      </div>

      {/* Desktop table */}
      <div className="max-[880px]:hidden rounded-(--radius) overflow-hidden border border-border bg-card shadow-card">
        {/* Header row */}
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="px-5.5 py-5 font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground flex items-end">
            Cecha
          </div>
          <div className="px-5.5 py-5 font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground flex items-end">
            Projektant wnętrz
          </div>
          <div className="px-5.5 py-5 font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground flex items-end">
            Inspiracje na Pinterest
          </div>
          <div
            className="px-5.5 py-5 font-mono text-[11px] tracking-[0.12em] uppercase flex items-end border-t-2 text-primary font-semibold bg-accent/60 border-t-primary"
            style={{
              borderLeft: "1px solid hsl(var(--primary) / 0.3)",
              borderRight: "1px solid hsl(var(--primary) / 0.3)",
            }}
          >
            ZaaranżujTo
          </div>
        </div>

        {data.map((row, i) => (
          <div key={row.id} className="grid border-t border-border grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="px-5.5 py-5.5 text-[13.5px] text-muted-foreground flex items-center">
              {row.feature}
            </div>
            <div className="px-5.5 py-5.5 text-[14.5px] flex items-center">
              <CellValue value={row.designer} muted={row.designerMuted} />
            </div>
            <div className="px-5.5 py-5.5 text-[14.5px] flex items-center">
              <CellValue value={row.pinterest} muted={row.pinterestMuted} />
            </div>
            <div
              className={`px-5.5 py-5.5 text-[14.5px] flex items-center bg-accent/60 ${
                i === data.length - 1 ? "border-b-2 border-b-primary" : ""
              }`}
              style={{
                borderLeft: "1px solid hsl(var(--primary) / 0.3)",
                borderRight: "1px solid hsl(var(--primary) / 0.3)",
              }}
            >
              <CellValue value={row.zaaranzujto} positive={row.zaaranzujtoPositive} />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile stacked cards */}
      <div className="hidden max-[880px]:block">
        {[
          { name: "Projektant wnętrz", key: "designer" as const, us: false },
          { name: "Pinterest + zgadywanie", key: "pinterest" as const, us: false },
          { name: "ZaaranżujTo", key: "zaaranzujto" as const, us: true },
        ].map((col) => (
          <div
            key={col.key}
            className={`mb-3.5 rounded-(--radius) overflow-hidden border bg-card ${
              col.us ? "border-primary" : "border-border"
            }`}
          >
            <div
              className={`px-4.5 py-3.5 font-mono text-[11px] tracking-[0.12em] uppercase border-b border-border ${
                col.us ? "text-primary bg-accent/60" : "text-muted-foreground"
              }`}
            >
              {col.name}
            </div>
            {data.map((row, i) => (
              <div
                key={row.id}
                className={`grid gap-4 px-4.5 py-3 text-sm grid-cols-[1fr_auto] ${
                  i > 0 ? "border-t border-border/60" : ""
                }`}
              >
                <span className="text-[13px] text-muted-foreground">{row.feature}</span>
                <span className="font-medium text-right">
                  {col.key === "zaaranzujto" ? (
                    <CellValue value={row.zaaranzujto} positive={row.zaaranzujtoPositive} />
                  ) : col.key === "designer" ? (
                    <CellValue value={row.designer} muted={row.designerMuted} />
                  ) : (
                    <CellValue value={row.pinterest} muted={row.pinterestMuted} />
                  )}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
);

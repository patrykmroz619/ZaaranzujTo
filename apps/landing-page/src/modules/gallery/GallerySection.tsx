import type { ReactNode } from "react";

type TProps = {
  children: ReactNode;
};

export const GallerySection = ({ children }: TProps) => (
  <section id="galeria" className="py-24 max-[720px]:py-16 bg-muted">
    <div className="container">
      <div className="max-w-180 mx-auto mb-8 sm:mb-12 text-center">
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
          Galeria
        </span>
        <h2 className="mt-3.5 text-foreground text-[clamp(34px,5vw,52px)]">
          Zobacz, co zaprojektujesz
        </h2>
        <p className="mt-3.5 text-muted-foreground text-[17px]">
          Poniższa galeria to tylko próbka możliwości aplikacji ZaaranżujTo.
        </p>
      </div>
      {children}
    </div>
  </section>
);

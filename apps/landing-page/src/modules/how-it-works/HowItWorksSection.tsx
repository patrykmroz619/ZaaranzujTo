import { HowItWorksStep } from "./HowItWorksStep";

const STEPS = [
  {
    n: "01",
    title: "Wgraj",
    description:
      "Dodaj zdjęcie pomieszczenia - może być puste lub z istniejącym umeblowaniem, które chcesz wymienić.",
    slotLabel: "Screenshot z aplikacji — ekran wgrywania zdjęcia",
  },
  {
    n: "02",
    title: "Skonfiguruj",
    description:
      "Wybierz styl, paletę kolorów i dodaj zdjęcia mebli i akscesoriów, które rozważasz. AI weźmie pod uwagę Twoje inspiracje.",
    slotLabel: "Screenshot z aplikacji — ekran konfiguracji stylu",
  },
  {
    n: "03",
    title: "Wygeneruj",
    description: "Zobacz swój pokój w nowej odsłonie w mniej niż minutę. ",
    slotLabel: "Screenshot z aplikacji — wygenerowana wizualizacja",
  },
  {
    n: "04",
    title: "Doprecyzuj",
    description:
      "Opisz zmiany, które chcesz wprowadzić bądź dodaj zdjęcia dodatkowych elementów. Narzędzie wygeneruje kolejną iterację projektu, coraz bardziej dopasowaną do Twojej wizji.",
    slotLabel: "Screenshot z aplikacji — porównanie iteracji",
    showAdvantage: true,
  },
] as const;

export const HowItWorksSection = () => (
  <section id="jak" className="py-24 max-[720px]:py-16">
    <div className="container">
      <div className="max-w-180 mx-auto mb-8 sm:mb-12 text-center">
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
          Jak to działa
        </span>
        <h2 className="mt-3.5 text-foreground text-[clamp(34px,5vw,52px)]">
          Cztery kroki od pustego pokoju do gotowego projektu
        </h2>
      </div>

      <div className="flex flex-col gap-20 max-[720px]:gap-14">
        {STEPS.map((step, i) => (
          <HowItWorksStep
            key={step.n}
            stepNumber={step.n}
            title={step.title}
            description={step.description}
            slotLabel={step.slotLabel}
            reverse={i % 2 === 1}
            showAdvantage={"showAdvantage" in step ? step.showAdvantage : false}
          />
        ))}
      </div>
    </div>
  </section>
);

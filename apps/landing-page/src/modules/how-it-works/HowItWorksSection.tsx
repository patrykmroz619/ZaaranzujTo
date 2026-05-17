import { HowItWorksStep } from "./HowItWorksStep";

const STEPS = [
  {
    n: "01",
    title: "Wgraj",
    description:
      "Dodaj zdjęcie pustego pomieszczenia. Nie masz jeszcze kluczy? Opisz pokój słowami — wymiary, układ okien, kierunek światła.",
    slotLabel: "Screenshot z aplikacji — ekran wgrywania zdjęcia",
  },
  {
    n: "02",
    title: "Skonfiguruj",
    description:
      "Wybierz styl, paletę kolorów i dodaj zdjęcia mebli, które rozważasz. AI weźmie pod uwagę Twoje inspiracje.",
    slotLabel: "Screenshot z aplikacji — ekran konfiguracji stylu",
  },
  {
    n: "03",
    title: "Wygeneruj",
    description:
      "Pierwsza wizualizacja gotowa w mniej niż minutę. Bez czekania, bez maili, bez umawiania spotkań.",
    slotLabel: "Screenshot z aplikacji — wygenerowana wizualizacja",
  },
  {
    n: "04",
    title: "Doprecyzuj",
    description:
      "Zmień styl, podmień sofę, dopasuj kolory — bez zaczynania od zera. To jest moment, w którym przestajemy być generatorem AI, a stajemy się narzędziem projektowym.",
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
        <p className="mt-3.5 text-muted-foreground text-[17px]">
          Bez umawiania spotkań. Bez wysyłania plików mailem. Bez czekania tygodniami.
        </p>
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

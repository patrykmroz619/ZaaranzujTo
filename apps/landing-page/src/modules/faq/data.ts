export type TFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const FAQ_DATA: TFaqItem[] = [
  {
    id: "kredyt",
    question: "Co dokładnie dostajesz za jeden kredyt?",
    answer:
      "Jeden kredyt to jedna wizualizacja wnętrza w wybranym stylu, gotowa do pobrania. Każda kolejna iteracja — zmiana stylu, podmiana mebla, inna paleta kolorów — to kolejny kredyt.",
  },
  {
    id: "zdjecie",
    question: "Czy potrzebujesz zdjęcia pomieszczenia?",
    answer:
      "Nie. Możesz wgrać zdjęcie pustego pokoju albo opisać go słowami — wymiary, układ okien, kierunek światła. Z opisu też wygenerujemy realistyczną wizualizację.",
  },
  {
    id: "vs-ai",
    question: "Czym to się różni od ChatGPT, Midjourney albo darmowych generatorów?",
    answer:
      "Generatory ogólne tworzą obrazy od zera za każdym razem. ZaaranżujTo pracuje na Twoim konkretnym pokoju i pozwala iterować — zachowując bryłę, układ i światło — aż dojdziesz do projektu, który Ci się podoba.",
  },
  {
    id: "iteracje",
    question: "Ile iteracji potrzeba, żeby osiągnąć dobry efekt?",
    answer:
      "Większość użytkowników jest zadowolona po 3–5 iteracjach. Możesz zacząć od szerokiego stylu, kolorów a potem doprecyzować konkretne meble i detale — bez zaczynania od zera za każdym razem.",
  },
  {
    id: "platnosc",
    question: "Jak działa płatność? Czy kredyty wygasą?",
    answer:
      "Płacisz raz za pakiet kredytów (BLIK, karta lub przelew). Kredyty zostają na koncie bez ograniczeń czasowych. Brak abonamentu, brak automatycznego odnawiania.",
  },
];

import { lowestPriceLabel } from "@/lib/pricing";

export type TComparisonRow = {
  id: string;
  feature: string;
  designer: string;
  pinterest: string;
  zaaranzujto: string;
  designerMuted?: boolean;
  pinterestMuted?: boolean;
  zaaranzujtoPositive?: boolean;
};

export const COMPARISON_DATA: TComparisonRow[] = [
  {
    id: "koszt",
    feature: "Koszt",
    designer: "Od kilkuset do kilku tysięcy PLN",
    pinterest: "Pozornie za darmo (czas + pomyłki)",
    zaaranzujto: `Od ${lowestPriceLabel} PLN`,
    designerMuted: true,
    pinterestMuted: true,
  },
  {
    id: "czas",
    feature: "Czas do rezultatu",
    designer: "Tygodnie / miesiące",
    pinterest: "Godziny scrollowania",
    zaaranzujto: "Minuty",
    designerMuted: true,
    pinterestMuted: true,
  },
  {
    id: "personalizacja",
    feature: "Personalizacja pod Twoje pomieszczenie",
    designer: "✓ Tak",
    pinterest: "✕ Nie",
    zaaranzujto: "✓ Tak",
    designerMuted: false,
    pinterestMuted: true,
    zaaranzujtoPositive: true,
  },
  {
    id: "iteracje",
    feature: "Możliwość iteracji i zmian",
    designer: "Ograniczona",
    pinterest: "✕ Brak",
    zaaranzujto: "Bez limitu (1 kredyt = 1 iteracja)",
    designerMuted: true,
    pinterestMuted: true,
  },
  {
    id: "spotkania",
    feature: "Wymaga umawiania spotkań",
    designer: "✕ Tak",
    pinterest: "✓ Nie",
    zaaranzujto: "✓ Nie",
    designerMuted: true,
    pinterestMuted: false,
    zaaranzujtoPositive: true,
  },
];

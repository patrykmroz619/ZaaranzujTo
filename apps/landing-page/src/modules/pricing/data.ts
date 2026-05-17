export type TPricingPackage = {
  id: string;
  name: string;
  credits: number;
  pricePln: number;
  isPopular: boolean;
  savingsPercent: number | null;
};

export const PRICING_DATA: TPricingPackage[] = [
  { id: "starter", name: "Starter", credits: 5, pricePln: 29, isPopular: false, savingsPercent: null },
  { id: "standard", name: "Standard", credits: 20, pricePln: 89, isPopular: true, savingsPercent: 23 },
  { id: "pro", name: "Pro", credits: 50, pricePln: 179, isPopular: false, savingsPercent: 38 },
];

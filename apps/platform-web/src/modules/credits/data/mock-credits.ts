import type { TCreditPackage } from "../types/credits.types";

export const MOCK_CREDIT_PACKAGES: TCreditPackage[] = [
  { id: "starter", name: "Starter", credits: 10, price: 19.99, isPopular: false },
  { id: "standard", name: "Standard", credits: 30, price: 49.99, isPopular: true },
  { id: "pro", name: "Pro", credits: 100, price: 129.99, isPopular: false },
];

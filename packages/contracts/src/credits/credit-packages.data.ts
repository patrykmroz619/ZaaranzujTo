import type { TCreditPackage } from "./credits.contract";

export const CREDIT_PACKAGES: TCreditPackage[] = [
  {
    packageCode: "starter",
    name: "Starter",
    credits: 10,
    price: { amount: 9.99, currency: "PLN" },
    isActive: true,
    isPopular: false,
  },
  {
    packageCode: "standard",
    name: "Standard",
    credits: 30,
    price: { amount: 24.99, currency: "PLN" },
    isActive: true,
    isPopular: true,
  },
  {
    packageCode: "pro",
    name: "Pro",
    credits: 100,
    price: { amount: 69.99, currency: "PLN" },
    isActive: true,
    isPopular: false,
  },
];

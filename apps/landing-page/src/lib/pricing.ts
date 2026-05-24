import { CREDIT_PACKAGES } from "@repo/contracts/credits";

const activePackages = CREDIT_PACKAGES.filter((p) => p.isActive);

export const lowestPrice = Math.min(...activePackages.map((p) => p.price.amount));

export const lowestPriceLabel = String(lowestPrice).replace(".", ",");

import {
  creditPackageSchema,
  getCreditPackagesResponseSchema,
  type TCreditPackage,
  type TGetCreditPackagesResponse,
} from "@repo/contracts/credits";

import type { TCreditPackageConfig } from "../config/credit-packages.config";

export const mapCreditPackageConfigToContract = (params: {
  packageConfig: TCreditPackageConfig;
}): TCreditPackage => {
  const { packageConfig } = params;

  return creditPackageSchema.parse({
    packageCode: packageConfig.packageCode,
    name: packageConfig.name,
    credits: packageConfig.credits,
    price: {
      amount: packageConfig.price.amount,
      currency: packageConfig.price.currency,
    },
    isActive: packageConfig.isActive,
  });
};

export const mapCreditPackagesToResponse = (params: {
  packages: TCreditPackageConfig[];
}): TGetCreditPackagesResponse => {
  const { packages } = params;

  const mappedItems = packages.map((item) => {
    return mapCreditPackageConfigToContract({ packageConfig: item });
  });

  return getCreditPackagesResponseSchema.parse({
    items: mappedItems,
  });
};

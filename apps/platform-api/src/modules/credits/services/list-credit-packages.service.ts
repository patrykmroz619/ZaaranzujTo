import { Injectable } from "@nestjs/common";

import type { TGetCreditPackagesResponse } from "@repo/contracts/credits";

import { CreditPackagesConfig } from "../config/credit-packages.config";
import { mapCreditPackagesToResponse } from "../mappers/credit-package.mapper";

@Injectable()
export class ListCreditPackagesService {
  constructor(private readonly creditPackagesConfig: CreditPackagesConfig) {}

  listPackages(): TGetCreditPackagesResponse {
    const activePackages = this.creditPackagesConfig.getActive();

    return mapCreditPackagesToResponse({
      packages: activePackages,
    });
  }
}

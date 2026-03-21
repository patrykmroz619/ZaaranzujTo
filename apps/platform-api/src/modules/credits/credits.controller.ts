import { Controller, Get, UseGuards } from "@nestjs/common";

import { AuthGuard, CurrentUser, type TAuthData } from "@/shared/auth";

import { GetBalanceService } from "./services/get-balance.service";
import { ListCreditPackagesService } from "./services/list-credit-packages.service";

@Controller("credits")
@UseGuards(AuthGuard)
export class CreditsController {
  constructor(
    private readonly getBalanceService: GetBalanceService,
    private readonly listCreditPackagesService: ListCreditPackagesService,
  ) {}

  @Get("balance")
  getBalance(@CurrentUser() currentUser: TAuthData) {
    return this.getBalanceService.getBalance({
      clerkId: currentUser.userId,
      email: currentUser.email,
    });
  }

  @Get("packages")
  listPackages() {
    return this.listCreditPackagesService.listPackages();
  }
}

import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { ApiKeyGuard, AuthGuard, CurrentUser, type TAuthData } from "@/shared/auth";

import { ManualCreditTopupRequestDto } from "./credits.dto";
import { GetBalanceService } from "./services/get-balance.service";
import { ListCreditPackagesService } from "./services/list-credit-packages.service";
import { TopUpCreditService } from "./services/top-up-credit.service";

@Controller("credits")
export class CreditsController {
  constructor(
    private readonly getBalanceService: GetBalanceService,
    private readonly listCreditPackagesService: ListCreditPackagesService,
    private readonly topUpCreditService: TopUpCreditService,
  ) {}

  @Get("balance")
  @UseGuards(AuthGuard)
  getBalance(@CurrentUser() currentUser: TAuthData) {
    return this.getBalanceService.getBalance({
      clerkId: currentUser.userId,
      email: currentUser.email,
    });
  }

  @Get("packages")
  @UseGuards(AuthGuard)
  listPackages() {
    return this.listCreditPackagesService.listPackages();
  }

  @Post("topup")
  @UseGuards(ApiKeyGuard)
  topUpCredits(@Body() body: ManualCreditTopupRequestDto) {
    return this.topUpCreditService.topUp(body);
  }
}

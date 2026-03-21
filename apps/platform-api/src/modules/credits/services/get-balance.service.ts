import { Injectable } from "@nestjs/common";

import type { TCreditBalance } from "@repo/contracts/credits";

import { GetUserService } from "../../users/services/get-user.service";
import { mapCreditAccountToBalance, mapVirtualZeroBalance } from "../mappers/credit-balance.mapper";
import { CreditAccountsRepository } from "../repositories/credit-accounts.repository";

type TGetBalanceParams = {
  clerkId: string;
  email: string;
};

@Injectable()
export class GetBalanceService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly creditAccountsRepository: CreditAccountsRepository,
  ) {}

  getBalance = async (params: TGetBalanceParams): Promise<TCreditBalance> => {
    const { clerkId, email } = params;

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    const account = await this.creditAccountsRepository.findByUserId({
      userId: user._id,
    });

    if (!account) {
      return mapVirtualZeroBalance();
    }

    return mapCreditAccountToBalance({ account });
  };
}

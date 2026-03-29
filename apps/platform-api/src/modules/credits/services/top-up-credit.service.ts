import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import type { TCreditBalance } from "@repo/contracts/credits";

import { mapCreditAccountToBalance } from "../mappers/credit-balance.mapper";
import { CreditAccountsRepository } from "../repositories/credit-accounts.repository";
import { CreditLedgerRepository } from "../repositories/credit-ledger.repository";
import { CreditsOperationsLogger } from "./internal/credits-operations.logger";

type TTopUpCreditParams = {
  userId: string;
  amount: number;
  reason?: string;
};

type TTopUpCreditResult = {
  toppedUpAmount: number;
  balance: TCreditBalance;
};

@Injectable()
export class TopUpCreditService {
  constructor(
    private readonly creditAccountsRepository: CreditAccountsRepository,
    private readonly creditLedgerRepository: CreditLedgerRepository,
    private readonly creditsOperationsLogger: CreditsOperationsLogger,
  ) {}

  topUp = async (params: TTopUpCreditParams): Promise<TTopUpCreditResult> => {
    const { userId, amount, reason } = params;
    const userObjectId = new Types.ObjectId(userId);

    const account = await this.creditAccountsRepository.getOrCreateByUserId({
      userId: userObjectId,
    });

    account.balance += amount;
    account.version += 1;
    await account.save();

    await this.creditLedgerRepository.append({
      userId: userObjectId,
      type: "topUp",
      amount,
      source: {
        module: "credits",
        entityId: reason ?? "manual-topup",
      },
    });

    this.creditsOperationsLogger.log({
      operation: "topUp",
      status: "topup_applied",
      userId,
      amount,
    });

    return {
      toppedUpAmount: amount,
      balance: mapCreditAccountToBalance({ account }),
    };
  };
}

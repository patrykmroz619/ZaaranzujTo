import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";

import {
  reserveCreditInputSchema,
  reserveCreditResultSchema,
  type TReserveCreditInput,
  type TReserveCreditResult,
} from "../credits.dto";
import { toCreditsHttpException } from "../errors/credits.errors";
import { mapCreditAccountToBalance } from "../mappers/credit-balance.mapper";
import { CreditAccountsRepository } from "../repositories/credit-accounts.repository";
import { CreditLedgerRepository } from "../repositories/credit-ledger.repository";
import { CreditIdempotencyService } from "./internal/credit-idempotency.service";
import { CreditsOperationsLogger } from "./internal/credits-operations.logger";

@Injectable()
export class ReserveCreditService {
  constructor(
    private readonly creditAccountsRepository: CreditAccountsRepository,
    private readonly creditLedgerRepository: CreditLedgerRepository,
    private readonly creditIdempotencyService: CreditIdempotencyService,
    private readonly creditsOperationsLogger: CreditsOperationsLogger,
  ) {}

  reserve = async (params: TReserveCreditInput): Promise<TReserveCreditResult> => {
    const parsedInput = reserveCreditInputSchema.parse(params);
    const userObjectId = new Types.ObjectId(parsedInput.userId);

    const replay = await this.creditIdempotencyService.getReplay<TReserveCreditResult>({
      userId: userObjectId,
      operation: "reserve_credit",
      idempotencyKey: parsedInput.idempotencyKey,
      requestPayload: parsedInput,
    });

    if (replay) {
      this.creditsOperationsLogger.log({
        operation: "reserve",
        status: "idempotent_replay",
        userId: parsedInput.userId,
        reservationId: parsedInput.reservationId,
        idempotencyKey: parsedInput.idempotencyKey,
      });

      return reserveCreditResultSchema.parse({ ...replay, idempotentReplay: true });
    }

    const account = await this.creditAccountsRepository.adjustReservedIfAvailable({
      userId: userObjectId,
      amount: parsedInput.amount,
    });

    if (!account) {
      throw toCreditsHttpException({ code: "INSUFFICIENT_CREDITS" });
    }

    await this.creditLedgerRepository.append({
      userId: userObjectId,
      type: "reserve",
      amount: parsedInput.amount,
      reservationId: parsedInput.reservationId,
      idempotencyKey: parsedInput.idempotencyKey,
      source: parsedInput.source,
    });

    const response = reserveCreditResultSchema.parse({
      reservationId: parsedInput.reservationId,
      balance: mapCreditAccountToBalance({ account }),
      idempotentReplay: false,
    });

    await this.creditIdempotencyService.saveReplay({
      userId: userObjectId,
      operation: "reserve_credit",
      idempotencyKey: parsedInput.idempotencyKey,
      requestPayload: parsedInput,
      responsePayload: response,
    });

    this.creditsOperationsLogger.log({
      operation: "reserve",
      status: "reserved",
      userId: parsedInput.userId,
      reservationId: parsedInput.reservationId,
      idempotencyKey: parsedInput.idempotencyKey,
    });

    return response;
  };
}

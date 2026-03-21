import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";

import {
  consumeCreditInputSchema,
  finalizeCreditResultSchema,
  type TConsumeCreditInput,
  type TFinalizeCreditResult,
} from "../credits.dto";
import { toCreditsHttpException } from "../errors/credits.errors";
import { mapCreditAccountToBalance } from "../mappers/credit-balance.mapper";
import { CreditAccountsRepository } from "../repositories/credit-accounts.repository";
import { CreditLedgerRepository } from "../repositories/credit-ledger.repository";
import { CreditIdempotencyService } from "./internal/credit-idempotency.service";
import { CreditsOperationsLogger } from "./internal/credits-operations.logger";
import { ReservationTransitionGuard } from "./internal/reservation-transition.guard";

@Injectable()
export class ConsumeCreditService {
  constructor(
    private readonly creditAccountsRepository: CreditAccountsRepository,
    private readonly creditLedgerRepository: CreditLedgerRepository,
    private readonly creditIdempotencyService: CreditIdempotencyService,
    private readonly reservationTransitionGuard: ReservationTransitionGuard,
    private readonly creditsOperationsLogger: CreditsOperationsLogger,
  ) {}

  consume = async (params: TConsumeCreditInput): Promise<TFinalizeCreditResult> => {
    const parsedInput = consumeCreditInputSchema.parse(params);
    const userObjectId = new Types.ObjectId(parsedInput.userId);

    const replay = await this.creditIdempotencyService.getReplay<TFinalizeCreditResult>({
      userId: userObjectId,
      operation: "consume_credit",
      idempotencyKey: parsedInput.idempotencyKey,
      requestPayload: parsedInput,
    });

    if (replay) {
      this.creditsOperationsLogger.log({
        operation: "consume",
        status: "idempotent_replay",
        userId: parsedInput.userId,
        reservationId: parsedInput.reservationId,
        idempotencyKey: parsedInput.idempotencyKey,
      });

      return finalizeCreditResultSchema.parse({ ...replay, idempotentReplay: true });
    }

    const reservationState = await this.reservationTransitionGuard.getState({
      userId: userObjectId,
      reservationId: parsedInput.reservationId,
    });

    if (reservationState === "missing") {
      throw toCreditsHttpException({ code: "RESERVATION_NOT_FOUND" });
    }

    if (reservationState !== "active") {
      throw toCreditsHttpException({ code: "RESERVATION_ALREADY_FINALIZED" });
    }

    const account = await this.creditAccountsRepository.consumeReserved({
      userId: userObjectId,
      amount: 1,
    });

    if (!account) {
      throw toCreditsHttpException({ code: "RESERVATION_ALREADY_FINALIZED" });
    }

    await this.creditLedgerRepository.append({
      userId: userObjectId,
      type: "consume",
      amount: 1,
      reservationId: parsedInput.reservationId,
      idempotencyKey: parsedInput.idempotencyKey,
      source: parsedInput.source,
    });

    const response = finalizeCreditResultSchema.parse({
      reservationId: parsedInput.reservationId,
      status: "consumed",
      balance: mapCreditAccountToBalance({ account }),
      idempotentReplay: false,
    });

    await this.creditIdempotencyService.saveReplay({
      userId: userObjectId,
      operation: "consume_credit",
      idempotencyKey: parsedInput.idempotencyKey,
      requestPayload: parsedInput,
      responsePayload: response,
    });

    this.creditsOperationsLogger.log({
      operation: "consume",
      status: "consumed",
      userId: parsedInput.userId,
      reservationId: parsedInput.reservationId,
      idempotencyKey: parsedInput.idempotencyKey,
    });

    return response;
  };
}

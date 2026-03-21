import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";

import {
  compensateCreditInputSchema,
  finalizeCreditResultSchema,
  type TCompensateCreditInput,
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
export class CompensateCreditService {
  constructor(
    private readonly creditAccountsRepository: CreditAccountsRepository,
    private readonly creditLedgerRepository: CreditLedgerRepository,
    private readonly creditIdempotencyService: CreditIdempotencyService,
    private readonly reservationTransitionGuard: ReservationTransitionGuard,
    private readonly creditsOperationsLogger: CreditsOperationsLogger,
  ) {}

  compensate = async (params: TCompensateCreditInput): Promise<TFinalizeCreditResult> => {
    const parsedInput = compensateCreditInputSchema.parse(params);
    const userObjectId = new Types.ObjectId(parsedInput.userId);

    const replay = await this.creditIdempotencyService.getReplay<TFinalizeCreditResult>({
      userId: userObjectId,
      operation: "compensate_credit",
      idempotencyKey: parsedInput.idempotencyKey,
      requestPayload: parsedInput,
    });

    if (replay) {
      this.creditsOperationsLogger.log({
        operation: "compensate",
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

    const account = await this.creditAccountsRepository.compensateReserved({
      userId: userObjectId,
      amount: 1,
    });

    if (!account) {
      throw toCreditsHttpException({ code: "RESERVATION_ALREADY_FINALIZED" });
    }

    await this.creditLedgerRepository.append({
      userId: userObjectId,
      type: "compensate",
      amount: 1,
      reservationId: parsedInput.reservationId,
      idempotencyKey: parsedInput.idempotencyKey,
      source: parsedInput.source,
    });

    const response = finalizeCreditResultSchema.parse({
      reservationId: parsedInput.reservationId,
      status: "compensated",
      balance: mapCreditAccountToBalance({ account }),
      idempotentReplay: false,
    });

    await this.creditIdempotencyService.saveReplay({
      userId: userObjectId,
      operation: "compensate_credit",
      idempotencyKey: parsedInput.idempotencyKey,
      requestPayload: parsedInput,
      responsePayload: response,
    });

    this.creditsOperationsLogger.log({
      operation: "compensate",
      status: "compensated",
      userId: parsedInput.userId,
      reservationId: parsedInput.reservationId,
      idempotencyKey: parsedInput.idempotencyKey,
    });

    return response;
  };
}

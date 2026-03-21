import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

import { CompensateCreditService } from "@/modules/credits/services/compensate-credit.service";
import { ConsumeCreditService } from "@/modules/credits/services/consume-credit.service";
import { ReserveCreditService } from "@/modules/credits/services/reserve-credit.service";

type TReserveCreditsForIterationParams = {
  userId: string;
  visualizationId: string;
};

type TConsumeReservedCreditsForIterationParams = {
  userId: string;
  visualizationId: string;
  reservationId: string;
  mutationKey: string;
};

type TCompensateReservedCreditsForIterationParams = {
  userId: string;
  visualizationId: string;
  reservationId: string;
};

export type TIterationCreditReservation = {
  reservationId: string;
  mutationKey: string;
};

@Injectable()
export class IterationCreditsService {
  constructor(
    private readonly reserveCreditService: ReserveCreditService,
    private readonly consumeCreditService: ConsumeCreditService,
    private readonly compensateCreditService: CompensateCreditService,
  ) {}

  reserveCreditsForIteration = async (
    params: TReserveCreditsForIterationParams,
  ): Promise<TIterationCreditReservation> => {
    const { userId, visualizationId } = params;

    const reservationId = randomUUID();
    const mutationKey = randomUUID();

    await this.reserveCreditService.reserve({
      userId,
      amount: 1,
      reservationId,
      idempotencyKey: mutationKey,
      source: {
        module: "visualizations",
        entityId: visualizationId,
      },
    });

    return {
      reservationId,
      mutationKey,
    };
  };

  consumeReservedCreditsForIteration = async (params: TConsumeReservedCreditsForIterationParams) => {
    const { userId, visualizationId, reservationId, mutationKey } = params;

    await this.consumeCreditService.consume({
      userId,
      reservationId,
      idempotencyKey: mutationKey,
      source: {
        module: "visualizations",
        entityId: visualizationId,
      },
    });
  };

  compensateReservedCreditsForIteration = async (
    params: TCompensateReservedCreditsForIterationParams,
  ) => {
    const { userId, visualizationId, reservationId } = params;

    await this.compensateCreditService.compensate({
      userId,
      reservationId,
      reason: "iteration_generation_failed",
      idempotencyKey: randomUUID(),
      source: {
        module: "visualizations",
        entityId: visualizationId,
      },
    });
  };
}

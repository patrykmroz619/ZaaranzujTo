import { Injectable } from "@nestjs/common";
import type { Types } from "mongoose";

import { CreditLedgerRepository } from "../../repositories/credit-ledger.repository";

export type TReservationState = "missing" | "active" | "consumed" | "compensated";

@Injectable()
export class ReservationTransitionGuard {
  constructor(private readonly creditLedgerRepository: CreditLedgerRepository) {}

  getState = async (params: {
    userId: Types.ObjectId;
    reservationId: string;
  }): Promise<TReservationState> => {
    const { userId, reservationId } = params;

    const events = await this.creditLedgerRepository.findEventsByReservation({
      userId,
      reservationId,
    });

    if (events.length === 0) {
      return "missing";
    }

    const consumedEvent = events.find((event) => event.type === "consume");
    if (consumedEvent) {
      return "consumed";
    }

    const compensatedEvent = events.find((event) => event.type === "compensate");
    if (compensatedEvent) {
      return "compensated";
    }

    return "active";
  };
}

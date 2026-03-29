import { Injectable, Logger } from "@nestjs/common";

type TOperationStatus =
  | "reserved"
  | "consumed"
  | "compensated"
  | "topup_applied"
  | "idempotent_replay"
  | "conflict";

@Injectable()
export class CreditsOperationsLogger {
  private readonly logger = new Logger(CreditsOperationsLogger.name);

  log = (params: {
    operation: "reserve" | "consume" | "compensate" | "topUp";
    status: TOperationStatus;
    userId: string;
    reservationId?: string;
    idempotencyKey?: string;
    amount?: number;
  }): void => {
    const { operation, status, userId, reservationId, idempotencyKey, amount } = params;

    this.logger.log(
      JSON.stringify({
        operation,
        status,
        userId,
        reservationId,
        idempotencyKey,
        amount,
      }),
    );
  };
}

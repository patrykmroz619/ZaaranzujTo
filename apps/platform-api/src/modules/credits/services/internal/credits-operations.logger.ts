import { Injectable, Logger } from "@nestjs/common";

type TOperationStatus = "reserved" | "consumed" | "compensated" | "idempotent_replay" | "conflict";

@Injectable()
export class CreditsOperationsLogger {
  private readonly logger = new Logger(CreditsOperationsLogger.name);

  log = (params: {
    operation: "reserve" | "consume" | "compensate";
    status: TOperationStatus;
    userId: string;
    reservationId: string;
    idempotencyKey: string;
  }): void => {
    const { operation, status, userId, reservationId, idempotencyKey } = params;

    this.logger.log(
      JSON.stringify({
        operation,
        status,
        userId,
        reservationId,
        idempotencyKey,
      }),
    );
  };
}

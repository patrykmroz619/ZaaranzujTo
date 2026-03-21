import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import type { Types } from "mongoose";

import { toCreditsHttpException } from "../../errors/credits.errors";
import { CreditIdempotencyRepository } from "../../repositories/credit-idempotency.repository";

@Injectable()
export class CreditIdempotencyService {
  constructor(private readonly creditIdempotencyRepository: CreditIdempotencyRepository) {}

  getReplay = async <TResult extends Record<string, unknown>>(params: {
    userId: Types.ObjectId;
    operation: string;
    idempotencyKey: string;
    requestPayload: unknown;
  }): Promise<TResult | null> => {
    const { userId, operation, idempotencyKey, requestPayload } = params;

    const record = await this.creditIdempotencyRepository.findByKey({
      userId,
      operation,
      idempotencyKey,
    });

    if (!record) {
      return null;
    }

    const requestHash = this.hashPayload({ payload: requestPayload });

    if (record.requestHash !== requestHash) {
      throw toCreditsHttpException({ code: "IDEMPOTENCY_CONFLICT" });
    }

    return record.responsePayload as TResult;
  };

  saveReplay = async (params: {
    userId: Types.ObjectId;
    operation: string;
    idempotencyKey: string;
    requestPayload: unknown;
    responsePayload: Record<string, unknown>;
  }): Promise<void> => {
    const { userId, operation, idempotencyKey, requestPayload, responsePayload } = params;

    const requestHash = this.hashPayload({ payload: requestPayload });

    await this.creditIdempotencyRepository.createRecord({
      userId,
      operation,
      idempotencyKey,
      requestHash,
      responsePayload,
    });
  };

  private hashPayload = (params: { payload: unknown }): string => {
    const { payload } = params;

    return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  };
}

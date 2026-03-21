import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model, Types } from "mongoose";

import {
  CreditIdempotencyRecord,
  type TCreditIdempotencyDocument,
} from "../schemas/credit-idempotency.schema";

type TFindByKeyParams = {
  userId: Types.ObjectId;
  operation: string;
  idempotencyKey: string;
};

type TCreateRecordParams = {
  userId: Types.ObjectId;
  operation: string;
  idempotencyKey: string;
  requestHash: string;
  responsePayload: Record<string, unknown>;
};

@Injectable()
export class CreditIdempotencyRepository {
  constructor(
    @InjectModel(CreditIdempotencyRecord.name)
    private readonly creditIdempotencyModel: Model<CreditIdempotencyRecord>,
  ) {}

  findByKey = async (params: TFindByKeyParams): Promise<TCreditIdempotencyDocument | null> => {
    const { userId, operation, idempotencyKey } = params;

    return await this.creditIdempotencyModel.findOne({
      userId,
      operation,
      idempotencyKey,
    });
  };

  createRecord = async (params: TCreateRecordParams): Promise<TCreditIdempotencyDocument> => {
    const { userId, operation, idempotencyKey, requestHash, responsePayload } = params;

    return await this.creditIdempotencyModel.create({
      userId,
      operation,
      idempotencyKey,
      requestHash,
      responsePayload,
    });
  };
}

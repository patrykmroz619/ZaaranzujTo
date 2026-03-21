import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model, Types } from "mongoose";

import {
  CreditLedger,
  type TCreditLedgerDocument,
  type TCreditLedgerEventType,
} from "../schemas/credit-ledger.schema";

type TAppendLedgerEntryParams = {
  userId: Types.ObjectId;
  type: TCreditLedgerEventType;
  amount: number;
  reservationId?: string;
  idempotencyKey?: string;
  source: {
    module: string;
    entityId: string;
  };
};

type TFindEventsByReservationParams = {
  userId: Types.ObjectId;
  reservationId: string;
};

@Injectable()
export class CreditLedgerRepository {
  constructor(
    @InjectModel(CreditLedger.name)
    private readonly creditLedgerModel: Model<CreditLedger>,
  ) {}

  append = async (params: TAppendLedgerEntryParams): Promise<TCreditLedgerDocument> => {
    const { userId, type, amount, reservationId, idempotencyKey, source } = params;

    return await this.creditLedgerModel.create({
      userId,
      type,
      amount,
      reservationId,
      idempotencyKey,
      source,
    });
  };

  findEventsByReservation = async (
    params: TFindEventsByReservationParams,
  ): Promise<TCreditLedgerDocument[]> => {
    const { userId, reservationId } = params;

    return await this.creditLedgerModel
      .find({
        userId,
        reservationId,
      })
      .sort({ createdAt: 1 });
  };
}

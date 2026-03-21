import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model, Types } from "mongoose";

import { CreditAccount, type TCreditAccountDocument } from "../schemas/credit-account.schema";

type TUserIdParams = {
  userId: Types.ObjectId;
};

type TAdjustReservedIfAvailableParams = {
  userId: Types.ObjectId;
  amount: number;
};

type TFinalizeReservedParams = {
  userId: Types.ObjectId;
  amount: number;
};

@Injectable()
export class CreditAccountsRepository {
  constructor(
    @InjectModel(CreditAccount.name)
    private readonly creditAccountModel: Model<CreditAccount>,
  ) {}

  findByUserId = async (params: TUserIdParams): Promise<TCreditAccountDocument | null> => {
    const { userId } = params;

    return await this.creditAccountModel.findOne({ userId });
  };

  getOrCreateByUserId = async (params: TUserIdParams): Promise<TCreditAccountDocument> => {
    const { userId } = params;

    return await this.creditAccountModel.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: {
          userId,
          balance: 0,
          reserved: 0,
          version: 0,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );
  };

  adjustReservedIfAvailable = async (
    params: TAdjustReservedIfAvailableParams,
  ): Promise<TCreditAccountDocument | null> => {
    const { userId, amount } = params;

    return await this.creditAccountModel.findOneAndUpdate(
      {
        userId,
        $expr: {
          $gte: [{ $subtract: ["$balance", "$reserved"] }, amount],
        },
      },
      {
        $inc: {
          reserved: amount,
          version: 1,
        },
      },
      { returnDocument: "after" },
    );
  };

  consumeReserved = async (
    params: TFinalizeReservedParams,
  ): Promise<TCreditAccountDocument | null> => {
    const { userId, amount } = params;

    return await this.creditAccountModel.findOneAndUpdate(
      {
        userId,
        reserved: { $gte: amount },
      },
      {
        $inc: {
          balance: -amount,
          reserved: -amount,
          version: 1,
        },
      },
      { returnDocument: "after" },
    );
  };

  compensateReserved = async (
    params: TFinalizeReservedParams,
  ): Promise<TCreditAccountDocument | null> => {
    const { userId, amount } = params;

    return await this.creditAccountModel.findOneAndUpdate(
      {
        userId,
        reserved: { $gte: amount },
      },
      {
        $inc: {
          reserved: -amount,
          version: 1,
        },
      },
      { returnDocument: "after" },
    );
  };
}

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, Types } from "mongoose";

export type TCreditAccountDocument = HydratedDocument<CreditAccount>;

@Schema({ collection: "credit_accounts", timestamps: true })
export class CreditAccount {
  @Prop({ required: true, unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, default: 0, min: 0 })
  balance: number;

  @Prop({ required: true, default: 0, min: 0 })
  reserved: number;

  @Prop({ required: true, default: 0, min: 0 })
  version: number;

  createdAt: Date;
  updatedAt: Date;
}

export const CreditAccountSchema = SchemaFactory.createForClass(CreditAccount);

CreditAccountSchema.index({ userId: 1 }, { unique: true });

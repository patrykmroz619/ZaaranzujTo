import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { type HydratedDocument, type Types } from "mongoose";

export type TCreditLedgerEventType = "reserve" | "consume" | "compensate" | "topUp";

export type TCreditLedgerDocument = HydratedDocument<CreditLedger>;

@Schema({ _id: false })
export class CreditLedgerSource {
  @Prop({ required: true })
  module: string;

  @Prop({ required: true })
  entityId: string;
}

const CreditLedgerSourceSchema = SchemaFactory.createForClass(CreditLedgerSource);

@Schema({ collection: "credit_ledger", timestamps: { createdAt: true, updatedAt: false } })
export class CreditLedger {
  @Prop({ required: true, index: true, type: mongoose.Schema.Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true, type: String, enum: ["reserve", "consume", "compensate", "topUp"] })
  type: TCreditLedgerEventType;

  @Prop({ required: true, min: 1 })
  amount: number;

  @Prop()
  reservationId?: string;

  @Prop({ required: true, type: CreditLedgerSourceSchema })
  source: CreditLedgerSource;

  @Prop()
  idempotencyKey?: string;

  createdAt: Date;
}

export const CreditLedgerSchema = SchemaFactory.createForClass(CreditLedger);

CreditLedgerSchema.index({ userId: 1, createdAt: -1 });

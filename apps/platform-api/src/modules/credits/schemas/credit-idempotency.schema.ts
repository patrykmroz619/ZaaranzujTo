import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { type HydratedDocument, type Types } from "mongoose";

export type TCreditIdempotencyDocument = HydratedDocument<CreditIdempotencyRecord>;

@Schema({ collection: "credit_idempotency", timestamps: true })
export class CreditIdempotencyRecord {
  @Prop({ required: true, index: true, type: mongoose.Schema.Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true })
  operation: string;

  @Prop({ required: true })
  idempotencyKey: string;

  @Prop({ required: true })
  requestHash: string;

  @Prop({ required: true, type: Object })
  responsePayload: Record<string, unknown>;

  createdAt: Date;
  updatedAt: Date;
}

export const CreditIdempotencyRecordSchema = SchemaFactory.createForClass(CreditIdempotencyRecord);

CreditIdempotencyRecordSchema.index(
  { userId: 1, operation: 1, idempotencyKey: 1 },
  { unique: true },
);

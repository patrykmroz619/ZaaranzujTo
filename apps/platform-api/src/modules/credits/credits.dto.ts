import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { creditBalanceSchema, getCreditPackagesResponseSchema } from "@repo/contracts/credits";

export class CreditBalanceResponseDto extends createZodDto(creditBalanceSchema) {}

export class CreditPackagesResponseDto extends createZodDto(getCreditPackagesResponseSchema) {}

export const manualCreditTopupInputSchema = z
  .object({
    userId: z.string().regex(/^[a-f\d]{24}$/i),
    amount: z.number().int().positive(),
    reason: z.string().trim().min(1).max(256).optional(),
  })
  .strict();

export const manualCreditTopupResultSchema = z
  .object({
    toppedUpAmount: z.number().int().positive(),
    balance: creditBalanceSchema,
  })
  .strict();

export class ManualCreditTopupRequestDto extends createZodDto(manualCreditTopupInputSchema) {}

export class ManualCreditTopupResponseDto extends createZodDto(manualCreditTopupResultSchema) {}

const creditOperationSourceSchema = z
  .object({
    module: z.string().min(1),
    entityId: z.string().min(1),
  })
  .strict();

export const reserveCreditInputSchema = z
  .object({
    userId: z.string().regex(/^[a-f\d]{24}$/i),
    amount: z.number().int().positive().default(1),
    reservationId: z.string().min(1),
    idempotencyKey: z.string().uuid(),
    source: creditOperationSourceSchema,
  })
  .strict();

export const consumeCreditInputSchema = z
  .object({
    userId: z.string().regex(/^[a-f\d]{24}$/i),
    reservationId: z.string().min(1),
    idempotencyKey: z.string().uuid(),
    source: creditOperationSourceSchema,
  })
  .strict();

export const compensateCreditInputSchema = z
  .object({
    userId: z.string().regex(/^[a-f\d]{24}$/i),
    reservationId: z.string().min(1),
    reason: z.string().min(1),
    idempotencyKey: z.string().uuid(),
    source: creditOperationSourceSchema,
  })
  .strict();

export const reserveCreditResultSchema = z
  .object({
    reservationId: z.string().min(1),
    balance: creditBalanceSchema,
    idempotentReplay: z.boolean(),
  })
  .strict();

export const finalizeCreditResultSchema = z
  .object({
    reservationId: z.string().min(1),
    status: z.enum(["consumed", "compensated"]),
    balance: creditBalanceSchema,
    idempotentReplay: z.boolean(),
  })
  .strict();

export type TReserveCreditInput = z.infer<typeof reserveCreditInputSchema>;
export type TConsumeCreditInput = z.infer<typeof consumeCreditInputSchema>;
export type TCompensateCreditInput = z.infer<typeof compensateCreditInputSchema>;
export type TManualCreditTopupInput = z.infer<typeof manualCreditTopupInputSchema>;
export type TReserveCreditResult = z.infer<typeof reserveCreditResultSchema>;
export type TFinalizeCreditResult = z.infer<typeof finalizeCreditResultSchema>;
export type TManualCreditTopupResult = z.infer<typeof manualCreditTopupResultSchema>;

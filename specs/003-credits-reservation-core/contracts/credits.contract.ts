import { z } from "zod";

export const TObjectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Expected Mongo ObjectId string");

export const TErrorObjectSchema = z.object({
  statusCode: z.number().int().min(400).max(599),
  code: z.string().min(1),
  message: z.string().min(1),
  details: z.array(z.unknown()).optional(),
  requestId: z.string().min(1).optional(),
});

export const TCreditBalanceSchema = z.object({
  balance: z.number().int().min(0),
  reserved: z.number().int().min(0),
  available: z.number().int().min(0),
  updatedAt: z.string().datetime(),
});

export const TGetCreditsBalanceResponseSchema = TCreditBalanceSchema;

export const TPriceSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
});

export const TCreditPackageSchema = z.object({
  packageCode: z.string().min(1),
  name: z.string().min(1),
  credits: z.number().int().positive(),
  price: TPriceSchema,
  isActive: z.boolean(),
});

export const TGetCreditPackagesResponseSchema = z.object({
  items: z.array(TCreditPackageSchema),
});

export const TReserveCreditInputSchema = z.object({
  userId: TObjectIdSchema.or(z.string().min(1)),
  amount: z.number().int().positive().default(1),
  reservationId: z.string().min(1),
  source: z.object({
    module: z.string().min(1),
    entityId: TObjectIdSchema.or(z.string().min(1)),
  }),
  idempotencyKey: z.string().uuid(),
});

export const TReserveCreditResultSchema = z.object({
  reservationId: z.string().min(1),
  balance: TCreditBalanceSchema,
  idempotentReplay: z.boolean().default(false),
});

export const TConsumeCreditInputSchema = z.object({
  userId: TObjectIdSchema.or(z.string().min(1)),
  reservationId: z.string().min(1),
  source: z.object({
    module: z.string().min(1),
    entityId: TObjectIdSchema.or(z.string().min(1)),
  }),
  idempotencyKey: z.string().uuid(),
});

export const TCompensateCreditInputSchema = z.object({
  userId: TObjectIdSchema.or(z.string().min(1)),
  reservationId: z.string().min(1),
  reason: z.string().min(1),
  source: z.object({
    module: z.string().min(1),
    entityId: TObjectIdSchema.or(z.string().min(1)),
  }),
  idempotencyKey: z.string().uuid(),
});

export const TFinalizeCreditResultSchema = z.object({
  reservationId: z.string().min(1),
  status: z.enum(["consumed", "compensated"]),
  balance: TCreditBalanceSchema,
  idempotentReplay: z.boolean().default(false),
});

export type TErrorObject = z.infer<typeof TErrorObjectSchema>;
export type TCreditBalance = z.infer<typeof TCreditBalanceSchema>;
export type TGetCreditsBalanceResponse = z.infer<typeof TGetCreditsBalanceResponseSchema>;
export type TCreditPackage = z.infer<typeof TCreditPackageSchema>;
export type TGetCreditPackagesResponse = z.infer<typeof TGetCreditPackagesResponseSchema>;
export type TReserveCreditInput = z.infer<typeof TReserveCreditInputSchema>;
export type TReserveCreditResult = z.infer<typeof TReserveCreditResultSchema>;
export type TConsumeCreditInput = z.infer<typeof TConsumeCreditInputSchema>;
export type TCompensateCreditInput = z.infer<typeof TCompensateCreditInputSchema>;
export type TFinalizeCreditResult = z.infer<typeof TFinalizeCreditResultSchema>;

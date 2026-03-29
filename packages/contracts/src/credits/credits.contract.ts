import { z } from "zod";

export const creditBalanceSchema = z
  .object({
    balance: z.number().int().nonnegative(),
    reserved: z.number().int().nonnegative(),
    available: z.number().int().nonnegative(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type TCreditBalance = z.infer<typeof creditBalanceSchema>;

const creditPackagePriceSchema = z
  .object({
    amount: z.number().positive(),
    currency: z.string().length(3),
  })
  .strict();

export const creditPackageSchema = z
  .object({
    packageCode: z.string().min(1),
    name: z.string().min(1),
    credits: z.number().int().positive(),
    price: creditPackagePriceSchema,
    isActive: z.boolean(),
  })
  .strict();

export type TCreditPackage = z.infer<typeof creditPackageSchema>;

export const getCreditPackagesResponseSchema = z
  .object({
    items: z.array(creditPackageSchema),
  })
  .strict();

export type TGetCreditPackagesResponse = z.infer<typeof getCreditPackagesResponseSchema>;

export const manualCreditTopupRequestSchema = z
  .object({
    userId: z.string().regex(/^[a-f\d]{24}$/i),
    amount: z.number().int().positive(),
    reason: z.string().trim().min(1).max(256).optional(),
  })
  .strict();

export type TManualCreditTopupRequest = z.infer<typeof manualCreditTopupRequestSchema>;

export const manualCreditTopupResponseSchema = z
  .object({
    toppedUpAmount: z.number().int().positive(),
    balance: creditBalanceSchema,
  })
  .strict();

export type TManualCreditTopupResponse = z.infer<typeof manualCreditTopupResponseSchema>;

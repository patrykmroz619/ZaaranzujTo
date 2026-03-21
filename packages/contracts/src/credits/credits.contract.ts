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

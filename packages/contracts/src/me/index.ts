import { z } from "zod";

export const themeSchema = z.enum(["light", "dark", "system"]);

export type TTheme = z.infer<typeof themeSchema>;

export const userObjectSchema = z
  .object({
    id: z.string().min(1),
    clerkUserId: z.string().min(1),
    email: z.string().email(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type TUserObject = z.infer<typeof userObjectSchema>;

export const meResponseSchema = z
  .object({
    user: userObjectSchema,
    creditBalance: z.number().int().nonnegative(),
    theme: themeSchema,
  })
  .strict();

export type TMeResponse = z.infer<typeof meResponseSchema>;

export const updateMeRequestSchema = z
  .object({
    theme: themeSchema,
  })
  .strict();

export type TUpdateMeRequest = z.infer<typeof updateMeRequestSchema>;

export type TUpdateMeResponse = TMeResponse;

export const deleteMeRequestSchema = z
  .object({
    confirm: z.literal(true),
  })
  .strict();

export type TDeleteMeRequest = z.infer<typeof deleteMeRequestSchema>;

export const deleteMeResponseSchema = z
  .object({
    deleted: z.boolean(),
    scheduledAt: z.string().datetime(),
  })
  .strict();

export type TDeleteMeResponse = z.infer<typeof deleteMeResponseSchema>;

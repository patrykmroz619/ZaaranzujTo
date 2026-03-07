import { z } from 'zod';

export const profileSchema = z.object({
  nickname: z.string().min(1),
});

export type TProfile = z.infer<typeof profileSchema>;

export const meResponseSchema = z
  .object({
    userId: z.string().min(1),
    email: z.string().email(),
    profile: profileSchema,
  })
  .strict();

export type TMeResponse = z.infer<typeof meResponseSchema>;

const nicknameUpdateSchema = z
  .string()
  .transform((value) => value.trim())
  .refine((value) => value.length >= 1 && value.length <= 32, {
    message: 'Nickname must be 1-32 characters.',
  })
  .refine((value) => !/[\x00-\x1F\x7F]/.test(value), {
    message: 'Nickname contains invalid control characters.',
  });

export const updateMeProfileRequestSchema = z
  .object({
    nickname: nicknameUpdateSchema.optional(),
  })
  .strict()
  .refine((value) => value.nickname !== undefined, {
    message: 'At least one field must be provided.',
  });

export type TUpdateMeProfileRequest = z.infer<
  typeof updateMeProfileRequestSchema
>;

export type TUpdateMeProfileResponse = TMeResponse;

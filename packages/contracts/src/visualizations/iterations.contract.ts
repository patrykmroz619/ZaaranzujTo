import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/);

export const iterationStatusSchema = z.enum(["succeeded", "failed"]);

export type TIterationStatus = z.infer<typeof iterationStatusSchema>;

export const generationFailureCodeSchema = z.enum([
  "INSUFFICIENT_CREDITS",
  "FILE_TOO_LARGE",
  "INVALID_INPUT",
  "UPSTREAM_GENERATION_FAILURE",
  "ACTIVE_GENERATION_CONFLICT",
  "IDEMPOTENCY_CONFLICT",
]);

export type TGenerationFailureCode = z.infer<typeof generationFailureCodeSchema>;

export const iterationAssetSchema = z
  .object({
    assetId: objectIdSchema,
    role: z.enum(["input-primary", "input-reference", "output-generated"]),
    mimeType: z.string().min(1),
    sizeBytes: z.number().int().positive(),
  })
  .strict();

export type TIterationAsset = z.infer<typeof iterationAssetSchema>;

export const visualizationIterationSchema = z
  .object({
    iterationId: objectIdSchema,
    visualizationId: objectIdSchema,
    status: iterationStatusSchema,
    sequenceNumber: z.number().int().positive(),
    inputAssets: z.array(iterationAssetSchema).min(1),
    outputAsset: iterationAssetSchema.optional(),
    failureCode: generationFailureCodeSchema.optional(),
    createdAt: z.string().datetime(),
  })
  .strict();

export type TVisualizationIteration = z.infer<typeof visualizationIterationSchema>;

export const createIterationRequestBodySchema = z
  .object({
    stylePreset: z.string().min(1).max(100).optional(),
    promptContext: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type TCreateIterationRequestBody = z.infer<typeof createIterationRequestBodySchema>;

export const createIterationHeadersSchema = z
  .object({
    idempotencyKey: z.string().uuid(),
  })
  .strict();

export type TCreateIterationHeaders = z.infer<typeof createIterationHeadersSchema>;

export const createIterationPathParamsSchema = z
  .object({
    visualizationId: objectIdSchema,
  })
  .strict();

export type TCreateIterationPathParams = z.infer<typeof createIterationPathParamsSchema>;

export const createIterationResponseSchema = z
  .object({
    iteration: visualizationIterationSchema,
    idempotentReplay: z.boolean().default(false),
  })
  .strict();

export type TCreateIterationResponse = z.infer<typeof createIterationResponseSchema>;

import { z } from "zod";

export const TObjectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Expected Mongo ObjectId string");

export const TErrorObjectSchema = z.object({
  statusCode: z.number().int().min(400).max(599),
  code: z.string().min(1),
  message: z.string().min(1),
  details: z.array(z.unknown()).optional(),
  requestId: z.string().min(1).optional(),
});

export const TIterationStatusSchema = z.enum(["succeeded", "failed"]);

export const TGenerationFailureCodeSchema = z.enum([
  "INSUFFICIENT_CREDITS",
  "FILE_TOO_LARGE",
  "INVALID_INPUT",
  "UPSTREAM_GENERATION_FAILURE",
  "ACTIVE_GENERATION_CONFLICT",
]);

export const TIterationAssetSchema = z.object({
  assetId: TObjectIdSchema.or(z.string().min(1)),
  role: z.enum(["input-primary", "input-reference", "output-generated"]),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
});

export const TVisualizationIterationSchema = z.object({
  iterationId: TObjectIdSchema.or(z.string().min(1)),
  visualizationId: TObjectIdSchema.or(z.string().min(1)),
  status: TIterationStatusSchema,
  sequenceNumber: z.number().int().positive(),
  inputAssets: z.array(TIterationAssetSchema).min(1),
  outputAsset: TIterationAssetSchema.optional(),
  failureCode: TGenerationFailureCodeSchema.optional(),
  createdAt: z.string().datetime(),
});

export const TCreateIterationRequestBodySchema = z.object({
  stylePreset: z.string().min(1).max(100).optional(),
  promptContext: z.record(z.string(), z.unknown()).optional(),
});

export const TCreateIterationRequestFilesSchema = z.object({
  inputPhoto: z
    .array(TIterationAssetSchema.omit({ role: true }))
    .min(1)
    .max(1),
  referencePhotos: z
    .array(TIterationAssetSchema.omit({ role: true }))
    .max(8)
    .optional(),
});

export const TCreateIterationRequestSchema = z.object({
  visualizationId: TObjectIdSchema.or(z.string().min(1)),
  body: TCreateIterationRequestBodySchema,
  files: TCreateIterationRequestFilesSchema,
});

export const TCreateIterationResponseSchema = z.object({
  iteration: TVisualizationIterationSchema,
});

export const TGetVisualizationIterationsResponseSchema = z.object({
  items: z.array(TVisualizationIterationSchema),
});

export type TErrorObject = z.infer<typeof TErrorObjectSchema>;
export type TIterationStatus = z.infer<typeof TIterationStatusSchema>;
export type TGenerationFailureCode = z.infer<typeof TGenerationFailureCodeSchema>;
export type TIterationAsset = z.infer<typeof TIterationAssetSchema>;
export type TVisualizationIteration = z.infer<typeof TVisualizationIterationSchema>;
export type TCreateIterationRequestBody = z.infer<typeof TCreateIterationRequestBodySchema>;
export type TCreateIterationRequestFiles = z.infer<typeof TCreateIterationRequestFilesSchema>;
export type TCreateIterationRequest = z.infer<typeof TCreateIterationRequestSchema>;
export type TCreateIterationResponse = z.infer<typeof TCreateIterationResponseSchema>;
export type TGetVisualizationIterationsResponse = z.infer<
  typeof TGetVisualizationIterationsResponseSchema
>;

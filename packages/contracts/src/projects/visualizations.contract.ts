import { z } from "zod";

import { paginationSchema } from "../common/pagination";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/);

const numberQuerySchema = z.preprocess((value) => {
  if (value === undefined || value === null) return undefined;

  if (typeof value === "string") {
    const normalizedValue = value.trim();
    if (normalizedValue.length === 0) return undefined;

    const parsedNumber = Number(normalizedValue);
    if (Number.isNaN(parsedNumber)) {
      return value;
    }

    return parsedNumber;
  }

  return value;
}, z.number().int().positive());

const visualizationNameSchema = z
  .string()
  .transform((value) => value.trim())
  .refine((value) => value.length >= 1, {
    message: "Visualization name is required.",
  })
  .refine((value) => value.length <= 120, {
    message: "Visualization name must be at most 120 characters.",
  })
  .refine((value) => !/[\x00-\x1F\x7F]/.test(value), {
    message: "Visualization name contains invalid control characters.",
  });

export const visualizationModeSchema = z.enum(["fromPhoto", "fromScratch"]);

export type TVisualizationMode = z.infer<typeof visualizationModeSchema>;

export const visualizationProjectIdParamsSchema = z
  .object({
    projectId: objectIdSchema,
  })
  .strict();

export type TVisualizationProjectIdParams = z.infer<typeof visualizationProjectIdParamsSchema>;

export const visualizationIdParamsSchema = z
  .object({
    visualizationId: objectIdSchema,
  })
  .strict();

export type TVisualizationIdParams = z.infer<typeof visualizationIdParamsSchema>;

export const listProjectVisualizationsSortSchema = z.enum([
  "updatedAt:desc",
  "updatedAt:asc",
  "createdAt:desc",
  "createdAt:asc",
  "name:asc",
  "name:desc",
]);

export type TListProjectVisualizationsSort = z.infer<typeof listProjectVisualizationsSortSchema>;

export const listProjectVisualizationsQuerySchema = z
  .object({
    page: numberQuerySchema.optional().default(1),
    pageSize: numberQuerySchema
      .optional()
      .default(20)
      .refine((value) => value <= 100, {
        message: "pageSize cannot be greater than 100.",
      }),
    sort: listProjectVisualizationsSortSchema.optional().default("updatedAt:desc"),
  })
  .strict();

export type TListProjectVisualizationsQuery = z.infer<typeof listProjectVisualizationsQuerySchema>;

export const latestIterationSummarySchema = z
  .object({
    id: objectIdSchema,
    iterationNo: z.number().int().positive(),
    imageAssetId: objectIdSchema,
    createdAt: z.string().datetime(),
  })
  .strict();

export type TLatestIterationSummary = z.infer<typeof latestIterationSummarySchema>;

export const visualizationSummarySchema = z
  .object({
    id: objectIdSchema,
    projectId: objectIdSchema,
    name: z.string().min(1),
    mode: visualizationModeSchema,
    iterationsCount: z.number().int().nonnegative(),
    latestIteration: latestIterationSummarySchema.nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type TVisualizationSummary = z.infer<typeof visualizationSummarySchema>;

export const listProjectVisualizationsResponseSchema = z
  .object({
    items: z.array(visualizationSummarySchema),
    pagination: paginationSchema,
  })
  .strict();

export type TListProjectVisualizationsResponse = z.infer<
  typeof listProjectVisualizationsResponseSchema
>;

export const createVisualizationRequestSchema = z
  .object({
    name: visualizationNameSchema,
    mode: visualizationModeSchema,
  })
  .strict();

export type TCreateVisualizationRequest = z.infer<typeof createVisualizationRequestSchema>;

export const createVisualizationHeadersSchema = z
  .object({
    idempotencyKey: z.string().uuid(),
  })
  .strict();

export type TCreateVisualizationHeaders = z.infer<typeof createVisualizationHeadersSchema>;

export const iterationInputSchema = z
  .object({
    mode: z.string(),
    stylePreset: z.string().nullable().optional(),
    colors: z.array(z.string()),
    roomType: z.string().nullable().optional(),
    prompt: z.string().nullable().optional(),
    referenceAssets: z.array(objectIdSchema),
  })
  .strict();

export type TIterationInput = z.infer<typeof iterationInputSchema>;

export const iterationResultSchema = z
  .object({
    imageAssetId: objectIdSchema,
  })
  .strict();

export type TIterationResult = z.infer<typeof iterationResultSchema>;

export const iterationObjectSchema = z
  .object({
    id: objectIdSchema,
    iterationNo: z.number().int().positive(),
    baseIterationId: objectIdSchema.nullable(),
    status: z.string(),
    generationInput: iterationInputSchema,
    result: iterationResultSchema,
    createdAt: z.string().datetime(),
  })
  .strict();

export type TIterationObject = z.infer<typeof iterationObjectSchema>;

export const visualizationDetailsSchema = z
  .object({
    id: objectIdSchema,
    projectId: objectIdSchema,
    name: z.string().min(1),
    mode: visualizationModeSchema,
    inputRoomPhotoAssetId: objectIdSchema.nullable(),
    iterations: z.array(iterationObjectSchema),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type TVisualizationDetails = z.infer<typeof visualizationDetailsSchema>;

export const listVisualizationIterationsSortSchema = z.enum(["iterationNo:asc", "iterationNo:desc"]);

export type TListVisualizationIterationsSort = z.infer<typeof listVisualizationIterationsSortSchema>;

export const listVisualizationIterationsQuerySchema = z
  .object({
    page: numberQuerySchema.optional().default(1),
    pageSize: numberQuerySchema
      .optional()
      .default(50)
      .refine((value) => value <= 200, {
        message: "pageSize cannot be greater than 200.",
      }),
    sort: listVisualizationIterationsSortSchema.optional().default("iterationNo:asc"),
  })
  .strict();

export type TListVisualizationIterationsQuery = z.infer<
  typeof listVisualizationIterationsQuerySchema
>;

export const listVisualizationIterationsResponseSchema = z
  .object({
    items: z.array(iterationObjectSchema),
    pagination: paginationSchema,
  })
  .strict();

export type TListVisualizationIterationsResponse = z.infer<
  typeof listVisualizationIterationsResponseSchema
>;

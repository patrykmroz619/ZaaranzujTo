import { z } from "zod";

const TObjectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Expected Mongo ObjectId string");

export const TPaginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalItems: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

export const TLatestIterationSummarySchema = z.object({
  id: TObjectIdSchema,
  iterationNo: z.number().int().positive(),
  imageAssetId: TObjectIdSchema,
  createdAt: z.string().datetime(),
});

export const TVisualizationSummarySchema = z.object({
  id: TObjectIdSchema,
  projectId: TObjectIdSchema,
  name: z.string().min(1).max(120),
  mode: z.enum(["fromPhoto", "fromScratch"]),
  iterationsCount: z.number().int().min(0),
  latestIteration: TLatestIterationSummarySchema.nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const TListProjectVisualizationsQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sort: z.string().default("updatedAt:desc"),
});

export const TListProjectVisualizationsResponseSchema = z.object({
  items: z.array(TVisualizationSummarySchema),
  pagination: TPaginationSchema,
});

export const TCreateVisualizationBodySchema = z.object({
  name: z.string().min(1).max(120),
  mode: z.enum(["fromPhoto", "fromScratch"]),
});

export const TGenerationInputSchema = z.object({
  mode: z.string(),
  stylePreset: z.string().nullable().optional(),
  colors: z.array(z.string()).default([]),
  roomType: z.string().nullable().optional(),
  prompt: z.string().nullable().optional(),
  referenceAssets: z.array(TObjectIdSchema).default([]),
});

export const TIterationResultSchema = z.object({
  imageAssetId: TObjectIdSchema,
});

export const TIterationSchema = z.object({
  id: TObjectIdSchema,
  iterationNo: z.number().int().positive(),
  baseIterationId: TObjectIdSchema.nullable(),
  status: z.string(),
  generationInput: TGenerationInputSchema,
  result: TIterationResultSchema,
  createdAt: z.string().datetime(),
});

export const TVisualizationDetailsSchema = z.object({
  id: TObjectIdSchema,
  projectId: TObjectIdSchema,
  name: z.string().min(1).max(120),
  mode: z.enum(["fromPhoto", "fromScratch"]),
  inputRoomPhotoAssetId: TObjectIdSchema.nullable(),
  iterations: z.array(TIterationSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const TListVisualizationIterationsQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(200).default(50),
  sort: z.string().default("iterationNo:asc"),
});

export const TListVisualizationIterationsResponseSchema = z.object({
  items: z.array(TIterationSchema),
  pagination: TPaginationSchema,
});

export type TPagination = z.infer<typeof TPaginationSchema>;
export type TLatestIterationSummary = z.infer<typeof TLatestIterationSummarySchema>;
export type TVisualizationSummary = z.infer<typeof TVisualizationSummarySchema>;
export type TListProjectVisualizationsQuery = z.infer<typeof TListProjectVisualizationsQuerySchema>;
export type TListProjectVisualizationsResponse = z.infer<
  typeof TListProjectVisualizationsResponseSchema
>;
export type TCreateVisualizationBody = z.infer<typeof TCreateVisualizationBodySchema>;
export type TIteration = z.infer<typeof TIterationSchema>;
export type TVisualizationDetails = z.infer<typeof TVisualizationDetailsSchema>;
export type TListVisualizationIterationsQuery = z.infer<
  typeof TListVisualizationIterationsQuerySchema
>;
export type TListVisualizationIterationsResponse = z.infer<
  typeof TListVisualizationIterationsResponseSchema
>;

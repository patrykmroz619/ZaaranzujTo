import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/);

const numberQuerySchema = z.preprocess((value) => {
  if (value === undefined || value === null) return undefined;

  if (typeof value === "string") {
    const normalized = value.trim();
    if (normalized.length === 0) return undefined;

    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) {
      return value;
    }

    return parsed;
  }

  return value;
}, z.number().int().positive());

export const visualizationProjectIdParamsSchema = z
  .object({
    projectId: objectIdSchema,
  })
  .strict();

export const visualizationIdParamsSchema = z
  .object({
    visualizationId: objectIdSchema,
  })
  .strict();

export const listProjectVisualizationsQuerySchema = z
  .object({
    page: numberQuerySchema.optional().default(1),
    pageSize: numberQuerySchema
      .optional()
      .default(20)
      .refine((value) => value <= 100, {
        message: "pageSize cannot be greater than 100.",
      }),
    sort: z
      .enum([
        "updatedAt:desc",
        "updatedAt:asc",
        "createdAt:desc",
        "createdAt:asc",
        "name:asc",
        "name:desc",
      ])
      .optional()
      .default("updatedAt:desc"),
  })
  .strict();

export const listVisualizationIterationsQuerySchema = z
  .object({
    page: numberQuerySchema.optional().default(1),
    pageSize: numberQuerySchema
      .optional()
      .default(50)
      .refine((value) => value <= 200, {
        message: "pageSize cannot be greater than 200.",
      }),
    sort: z.enum(["iterationNo:asc", "iterationNo:desc"]).optional().default("iterationNo:asc"),
  })
  .strict();

export const createVisualizationRequestSchema = z
  .object({
    name: z
      .string()
      .transform((value) => value.trim())
      .refine((value) => value.length >= 1, {
        message: "Visualization name is required.",
      })
      .refine((value) => value.length <= 120, {
        message: "Visualization name must be at most 120 characters.",
      }),
    mode: z.enum(["fromPhoto", "fromScratch"]),
  })
  .strict();

export const createVisualizationIterationBodySchema = z
  .object({
    stylePreset: z
      .string()
      .transform((value) => value.trim())
      .refine((value) => value.length > 0, {
        message: "stylePreset cannot be empty.",
      })
      .optional(),
    promptContext: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const CREATE_ITERATION_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const CREATE_ITERATION_ALLOWED_MIME_PREFIX = "image/";

export class ProjectIdParamsDto extends createZodDto(visualizationProjectIdParamsSchema) {}

export class VisualizationIdParamsDto extends createZodDto(visualizationIdParamsSchema) {}

export class ListProjectVisualizationsQueryDto extends createZodDto(
  listProjectVisualizationsQuerySchema,
) {}

export class ListVisualizationIterationsQueryDto extends createZodDto(
  listVisualizationIterationsQuerySchema,
) {}

export class CreateVisualizationDto extends createZodDto(createVisualizationRequestSchema) {}

export type TProjectIdParams = z.infer<typeof visualizationProjectIdParamsSchema>;
export type TVisualizationIdParams = z.infer<typeof visualizationIdParamsSchema>;
export type TListProjectVisualizationsQuery = z.infer<typeof listProjectVisualizationsQuerySchema>;
export type TListVisualizationIterationsQuery = z.infer<
  typeof listVisualizationIterationsQuerySchema
>;
export type TCreateVisualizationRequest = z.infer<typeof createVisualizationRequestSchema>;
export type TCreateVisualizationIterationBody = z.infer<
  typeof createVisualizationIterationBodySchema
>;

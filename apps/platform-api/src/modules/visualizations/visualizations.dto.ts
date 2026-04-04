import { createZodDto } from "nestjs-zod";

import {
  createVisualizationRequestSchema,
  listProjectVisualizationsQuerySchema,
  listVisualizationIterationsQuerySchema,
  updateVisualizationRequestSchema,
  visualizationIdParamsSchema,
  visualizationProjectIdParamsSchema,
} from "@repo/contracts";

export { createVisualizationIterationBodySchema } from "@repo/contracts";
export type {
  TCreateVisualizationIterationBody,
  TCreateVisualizationRequest,
  TListProjectVisualizationsQuery,
  TListVisualizationIterationsQuery,
  TUpdateVisualizationRequest,
  TVisualizationIdParams,
} from "@repo/contracts";

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

export class UpdateVisualizationDto extends createZodDto(updateVisualizationRequestSchema) {}

// Re-export for controller use
export {
  createVisualizationRequestSchema,
  listProjectVisualizationsQuerySchema,
  listVisualizationIterationsQuerySchema,
  updateVisualizationRequestSchema,
  visualizationIdParamsSchema,
  visualizationProjectIdParamsSchema,
};

export type TProjectIdParams = {
  projectId: string;
};

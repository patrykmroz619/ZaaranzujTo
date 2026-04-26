import { z } from "zod";

import { paginationSchema } from "../common/pagination";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/);

const projectNameSchema = z
  .string()
  .transform((value) => value.trim())
  .refine((value) => value.length >= 1, {
    message: "Project name is required.",
  })
  .refine((value) => value.length <= 120, {
    message: "Project name must be at most 120 characters.",
  })
  .refine((value) => !/[\x00-\x1F\x7F]/.test(value), {
    message: "Project name contains invalid control characters.",
  });

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

export const projectSortSchema = z.enum([
  "createdAt:desc",
  "createdAt:asc",
  "updatedAt:desc",
  "updatedAt:asc",
  "name:desc",
  "name:asc",
]);

export type TProjectSort = z.infer<typeof projectSortSchema>;

export const projectObjectSchema = z
  .object({
    id: objectIdSchema,
    name: z.string().min(1),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type TProjectObject = z.infer<typeof projectObjectSchema>;

export const listProjectsQuerySchema = z
  .object({
    page: numberQuerySchema.optional().default(1),
    pageSize: numberQuerySchema
      .optional()
      .default(20)
      .refine((value) => value <= 100, {
        message: "pageSize cannot be greater than 100.",
      }),
    sort: projectSortSchema.optional().default("createdAt:desc"),
  })
  .strict();

export type TListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;

export const listProjectsResponseSchema = z
  .object({
    items: z.array(projectObjectSchema),
    pagination: paginationSchema,
  })
  .strict();

export type TListProjectsResponse = z.infer<typeof listProjectsResponseSchema>;

export const createProjectRequestSchema = z
  .object({
    name: projectNameSchema,
  })
  .strict();

export type TCreateProjectRequest = z.infer<typeof createProjectRequestSchema>;

export const createProjectResponseSchema = projectObjectSchema;

export type TCreateProjectResponse = z.infer<typeof createProjectResponseSchema>;

export const projectIdParamsSchema = z
  .object({
    projectId: objectIdSchema,
  })
  .strict();

export type TProjectIdParams = z.infer<typeof projectIdParamsSchema>;

export const getProjectResponseSchema = projectObjectSchema;

export type TGetProjectResponse = z.infer<typeof getProjectResponseSchema>;

export const updateProjectRequestSchema = z
  .object({
    name: projectNameSchema.optional(),
  })
  .strict()
  .refine((value) => value.name !== undefined, {
    message: "At least one field must be provided.",
  });

export type TUpdateProjectRequest = z.infer<typeof updateProjectRequestSchema>;

export const updateProjectResponseSchema = projectObjectSchema;

export type TUpdateProjectResponse = z.infer<typeof updateProjectResponseSchema>;

export const deleteProjectResponseSchema = z
  .object({
    deleted: z.literal(true),
    projectId: objectIdSchema,
  })
  .strict();

export type TDeleteProjectResponse = z.infer<typeof deleteProjectResponseSchema>;

export * from "./visualizations.contract";

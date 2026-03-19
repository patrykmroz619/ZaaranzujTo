import { createZodDto } from "nestjs-zod";

import {
  createProjectRequestSchema,
  listProjectsQuerySchema,
  projectIdParamsSchema,
  updateProjectRequestSchema,
} from "@repo/contracts/projects";

export class ListProjectsQueryDto extends createZodDto(listProjectsQuerySchema) {}

export class CreateProjectDto extends createZodDto(createProjectRequestSchema) {}

export class ProjectIdParamsDto extends createZodDto(projectIdParamsSchema) {}

export class UpdateProjectDto extends createZodDto(updateProjectRequestSchema) {}

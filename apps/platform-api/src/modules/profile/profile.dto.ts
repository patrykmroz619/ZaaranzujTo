import { createZodDto } from "nestjs-zod";

import { deleteMeRequestSchema, updateMeRequestSchema } from "@repo/contracts/me";

export class UpdateMeDto extends createZodDto(updateMeRequestSchema) {}

export class DeleteMeDto extends createZodDto(deleteMeRequestSchema) {}

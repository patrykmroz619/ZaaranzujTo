import { createZodDto } from "nestjs-zod";

import { updateMeProfileRequestSchema } from "@repo/contracts/me";

export class UpdateProfileDto extends createZodDto(
  updateMeProfileRequestSchema,
) {}

import { Module } from "@nestjs/common";

import { AiGenerationService } from "./services/ai-generation.service";
import { AiModerationService } from "./services/ai-moderation.service";

@Module({
  providers: [AiGenerationService, AiModerationService],
  exports: [AiGenerationService, AiModerationService],
})
export class AiModule {}

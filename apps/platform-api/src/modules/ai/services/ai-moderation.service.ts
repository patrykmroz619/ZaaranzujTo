import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

import { toIterationOrchestrationHttpException } from "@/modules/visualizations/errors/iteration-orchestration.errors";

type TModerateContentParams = {
  text?: string;
  images?: Array<{ base64: string; mediaType: string }>;
};

@Injectable()
export class AiModerationService {
  private readonly client: OpenAI;
  private readonly logger = new Logger(AiModerationService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>("openAiApiKey");
    this.client = new OpenAI({ apiKey });
  }

  moderateContent = async (params: TModerateContentParams): Promise<void> => {
    if (!this.client) return;

    const { text, images } = params;
    const input: OpenAI.Moderations.ModerationMultiModalInput[] = [];

    if (text && text.trim().length > 0) {
      input.push({ type: "text", text });
    }

    images?.forEach(({ base64, mediaType }) => {
      input.push({
        type: "image_url",
        image_url: { url: `data:${mediaType};base64,${base64}` },
      });
    });

    if (input.length === 0) return;

    this.logger.log(
      `[moderateContent] START hasText=${!!text} imagesCount=${images?.length ?? 0} inputCount=${input.length}`,
    );

    let response: OpenAI.Moderations.ModerationCreateResponse;

    try {
      response = await this.client.moderations.create({
        model: "omni-moderation-latest",
        input,
      });
    } catch (err) {
      this.logger.warn(
        `[moderateContent] Moderation API request failed: ${err instanceof Error ? err.message : String(err)}, skipping.`,
      );
      return;
    }

    const isFlagged = response.results.some((r) => r.flagged);

    this.logger.log(`[moderateContent] DONE isFlagged=${isFlagged}`);

    if (isFlagged) {
      const flaggedCategories = response.results
        .flatMap((r) =>
          Object.entries(r.categories)
            .filter(([, value]) => value)
            .map(([key]) => key),
        )
        .join(", ");

      this.logger.warn(`[moderateContent] Content flagged. Categories: ${flaggedCategories}`);
      throw toIterationOrchestrationHttpException({ code: "CONTENT_POLICY_VIOLATION" });
    }
  };
}

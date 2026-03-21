import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { generateImage } from "ai";

type TGenerateImageParams = {
  modelId: string;
  prompt: string;
  referenceImages?: Array<{
    base64: string;
    mediaType: string;
  }>;
};

type TGenerateImageResult = {
  base64: string;
  uint8Array: Uint8Array;
  mediaType: string;
};

type TOpenRouterProvider = ReturnType<typeof createOpenRouter>;

@Injectable()
export class AiGenerationService {
  private readonly openrouter: TOpenRouterProvider;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>("openRouterApiKey");
    const baseURL = this.configService.getOrThrow<string>("openRouterBaseUrl");

    this.openrouter = createOpenRouter({
      apiKey,
      baseURL,
    });
  }

  generateImage = async (params: TGenerateImageParams): Promise<TGenerateImageResult> => {
    const { modelId, prompt, referenceImages } = params;

    const imagePrompt =
      referenceImages && referenceImages.length > 0
        ? {
            images: referenceImages.map((image) => `data:${image.mediaType};base64,${image.base64}`),
            text: prompt,
          }
        : prompt;

    const response = await generateImage({
      model: this.openrouter.imageModel(modelId),
      prompt: imagePrompt,
    });

    return {
      base64: response.image.base64,
      uint8Array: response.image.uint8Array,
      mediaType: response.image.mediaType,
    };
  };
}

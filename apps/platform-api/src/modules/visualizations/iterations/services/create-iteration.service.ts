import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Types } from "mongoose";

import { AiGenerationService } from "@/modules/ai/services/ai-generation.service";
import { AiModerationService } from "@/modules/ai/services/ai-moderation.service";
import { ImageOptimizationService } from "@/modules/images/services/image-optimization.service";
import { FileAssetsService } from "@/modules/storage/services/file-assets.service";

import { toIterationOrchestrationHttpException } from "../../errors/iteration-orchestration.errors";
import { VisualizationsRepository } from "../../repositories/visualizations.repository";
import type { TVisualizationDocument } from "../../schemas/visualization.schema";
import { CreateIterationResponseMapper } from "../mappers/create-iteration-response.mapper";
import { IterationAssetsService } from "./internal/iteration-assets.service";
import {
  IterationCreditsService,
  type TIterationCreditReservation,
} from "./internal/iteration-credits.service";
import { IterationFilesValidatorService } from "./internal/iteration-files-validator.service";
import type { TUploadedFile } from "./internal/iteration.types";
import {
  generateFirstIterationPrompt,
  generateSubsequentIterationPrompt,
} from "../prompts/generate-vizualization-prompt";

type TCreateIterationParams = {
  visualization: TVisualizationDocument;
  userId: Types.ObjectId;
  prompt: string;
  inputPhoto: TUploadedFile | undefined;
  inspirationPhoto: TUploadedFile | undefined;
  parentIterationId: string | undefined;
  referencePhotos: TUploadedFile[];
};

@Injectable()
export class CreateIterationService {
  private readonly visualizationImageModel: string;
  private readonly logger = new Logger(CreateIterationService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly iterationFilesValidatorService: IterationFilesValidatorService,
    private readonly visualizationsRepository: VisualizationsRepository,

    private readonly iterationAssetsService: IterationAssetsService,
    private readonly iterationCreditsService: IterationCreditsService,
    private readonly aiModerationService: AiModerationService,
    private readonly aiGenerationService: AiGenerationService,
    private readonly imageOptimizationService: ImageOptimizationService,
    private readonly fileAssetsService: FileAssetsService,
    private readonly createIterationResponseMapper: CreateIterationResponseMapper,
  ) {
    this.visualizationImageModel = this.configService.getOrThrow<string>("visualizationImageModel");
  }

  createIteration = async (params: TCreateIterationParams) => {
    const {
      visualization,
      userId,
      prompt,
      inputPhoto,
      inspirationPhoto,
      parentIterationId,
      referencePhotos,
    } = params;

    const visualizationId = visualization._id.toString();
    const userIdStr = userId.toString();

    this.logger.log(
      `[createIteration] START visualizationId=${visualizationId} ` +
        `hasInputPhoto=${!!inputPhoto} hasInspirationPhoto=${!!inspirationPhoto} parentIterationId=${parentIterationId ?? "none"} ` +
        `referencePhotosCount=${referencePhotos.length} hasPrompt=${!!prompt}`,
    );

    const isInitialIteration = !parentIterationId;
    if (isInitialIteration && !inputPhoto && !prompt) {
      throw toIterationOrchestrationHttpException({ code: "INVALID_INPUT" });
    }
    if (!isInitialIteration && inputPhoto) {
      throw toIterationOrchestrationHttpException({ code: "INVALID_INPUT" });
    }

    this.iterationFilesValidatorService.validateFiles({
      inputPhoto,
      inspirationPhoto,
      referencePhotos,
    });

    const optimizedInputPhoto = inputPhoto
      ? await this.imageOptimizationService.optimize(inputPhoto, {
          maxDimensionPx: 1024,
          quality: 72,
        })
      : undefined;
    const optimizedInspirationPhoto = inspirationPhoto
      ? await this.imageOptimizationService.optimize(inspirationPhoto, {
          maxDimensionPx: 1024,
          quality: 72,
        })
      : undefined;
    const optimizedReferencePhotos = await this.imageOptimizationService.optimizeAll(
      referencePhotos,
      { maxDimensionPx: 1024, quality: 72 },
    );

    await this.moderateIterationContent({
      prompt,
      inputPhoto: optimizedInputPhoto,
      inspirationPhoto: optimizedInspirationPhoto,
      referencePhotos: optimizedReferencePhotos,
      stylePresetCustom: visualization.stylePresetCustom,
      paletteCustom: visualization.paletteCustom,
      roomTypeCustom: visualization.roomTypeCustom,
    });

    const isEditMode = !!parentIterationId;

    let previousOutputImage: { base64: string; mediaType: string } | null = null;

    if (parentIterationId) {
      const parent = visualization.iterations.find(
        (iteration) => iteration._id.toString() === parentIterationId,
      );

      if (!parent || !parent.outputAsset) {
        throw toIterationOrchestrationHttpException({ code: "INVALID_INPUT" });
      }

      const { buffer, mimeType } = await this.fileAssetsService.downloadAssetBuffer({
        assetId: parent.outputAsset,
        userId: userIdStr,
      });

      previousOutputImage = {
        base64: buffer.toString("base64"),
        mediaType: mimeType,
      };
    }

    const effectiveStylePreset =
      visualization.stylePreset === "other"
        ? (visualization.stylePresetCustom ?? undefined)
        : visualization.stylePreset;
    const effectivePalette =
      visualization.palette === "other"
        ? (visualization.paletteCustom ?? undefined)
        : visualization.palette;
    const effectiveRoomType =
      visualization.roomType === "other"
        ? (visualization.roomTypeCustom ?? undefined)
        : visualization.roomType;

    const builtPrompt = isEditMode
      ? generateSubsequentIterationPrompt({
          stylePreset: effectiveStylePreset,
          palette: effectivePalette,
          roomType: effectiveRoomType,
          prompt,
          hasReferencePhotos: referencePhotos.length > 0,
        })
      : generateFirstIterationPrompt({
          stylePreset: effectiveStylePreset,
          palette: effectivePalette,
          roomType: effectiveRoomType,
          prompt,
          hasInputPhoto: !!inputPhoto,
          hasInspirationPhoto: !!optimizedInspirationPhoto,
          hasReferencePhotos: referencePhotos.length > 0,
        });

    this.logger.log(`[createIteration] Prompt built isEditMode=${isEditMode}`);

    let creditReservation: TIterationCreditReservation | null = null;

    try {
      creditReservation = await this.iterationCreditsService.reserveCreditsForIteration({
        userId: userIdStr,
        visualizationId,
      });

      const allReferenceImages: Array<{ base64: string; mediaType: string }> = [];

      if (optimizedInputPhoto) {
        allReferenceImages.push({
          base64: optimizedInputPhoto.buffer.toString("base64"),
          mediaType: optimizedInputPhoto.mimetype,
        });
      }

      if (optimizedInspirationPhoto) {
        allReferenceImages.push({
          base64: optimizedInspirationPhoto.buffer.toString("base64"),
          mediaType: optimizedInspirationPhoto.mimetype,
        });
      }

      if (previousOutputImage) {
        allReferenceImages.push(previousOutputImage);
      }

      optimizedReferencePhotos.forEach((file) => {
        allReferenceImages.push({
          base64: file.buffer.toString("base64"),
          mediaType: file.mimetype,
        });
      });

      let generationResult: { mediaType: string; uint8Array: Uint8Array };

      try {
        generationResult = await this.aiGenerationService.generateImage({
          modelId: this.visualizationImageModel,
          prompt: builtPrompt,
          referenceImages: allReferenceImages,
        });
      } catch (err) {
        this.logger.error(
          `[createIteration] AI generation failed: ${err instanceof Error ? err.message : String(err)}`,
        );
        throw toIterationOrchestrationHttpException({ code: "UPSTREAM_GENERATION_FAILURE" });
      }

      const optimizedOutput = await this.imageOptimizationService.optimize({
        originalname: "output",
        mimetype: generationResult.mediaType,
        size: generationResult.uint8Array.byteLength,
        buffer: Buffer.from(generationResult.uint8Array),
      });

      const registeredAssetsBundle = await this.iterationAssetsService.uploadAssetsForIteration({
        userId: userIdStr,
        inputPhoto: optimizedInputPhoto,
        inspirationPhoto: optimizedInspirationPhoto,
        referencePhotos: optimizedReferencePhotos,
        outputMediaType: optimizedOutput.mimetype,
        outputBytes: optimizedOutput.buffer,
      });

      const updatedVisualization =
        await this.visualizationsRepository.appendIterationForVisualizationForUser({
          userId,
          visualizationId,
          status: "succeeded",
          failureCode: null,
          baseIterationId: parentIterationId ?? null,
          generationInput: {
            mode: "generation",
            prompt: prompt.length > 0 ? prompt : null,
            inputAsset: registeredAssetsBundle.inputAssetId,
            referenceAssets: registeredAssetsBundle.referenceAssetIds,
            inspirationAsset: registeredAssetsBundle.inspirationAssetId,
          },
          outputAsset: registeredAssetsBundle.outputAssetId,
          resultImageAssetId: registeredAssetsBundle.outputAssetId,
        });

      if (!updatedVisualization) {
        throw new NotFoundException("Visualization not found.");
      }

      await this.iterationCreditsService.consumeReservedCreditsForIteration({
        userId: userIdStr,
        visualizationId,
        reservationId: creditReservation.reservationId,
        mutationKey: creditReservation.mutationKey,
      });

      return {
        visualization: updatedVisualization,
        response: this.createIterationResponseMapper.map({
          visualizationDocument: updatedVisualization,
        }),
      };
    } catch (error) {
      await this.handleFailure({
        error,
        creditReservation,
        userId: userIdStr,
        visualizationId,
      });
      throw error;
    }
  };

  private handleFailure = async (params: {
    error: unknown;
    creditReservation: TIterationCreditReservation | null;
    userId: string;
    visualizationId: string;
  }) => {
    const { error, creditReservation, userId, visualizationId } = params;

    this.logger.error(
      `[createIteration] Generation failed: ${error instanceof Error ? error.message : String(error)}`,
    );

    if (creditReservation) {
      await this.iterationCreditsService
        .compensateReservedCreditsForIteration({
          userId,
          visualizationId,
          reservationId: creditReservation.reservationId,
        })
        .catch(() => undefined);
    }

    if (error instanceof NotFoundException) throw error;
    if (error instanceof Error && this.hasHttpStatus({ error })) throw error;
    throw toIterationOrchestrationHttpException({ code: "UPSTREAM_GENERATION_FAILURE" });
  };

  private moderateIterationContent = async (params: {
    prompt: string;
    inputPhoto: TUploadedFile | undefined;
    inspirationPhoto: TUploadedFile | undefined;
    referencePhotos: TUploadedFile[];
    stylePresetCustom?: string | null;
    paletteCustom?: string | null;
    roomTypeCustom?: string | null;
  }) => {
    const {
      prompt,
      inputPhoto,
      inspirationPhoto,
      referencePhotos,
      stylePresetCustom,
      paletteCustom,
      roomTypeCustom,
    } = params;

    const textParts = [
      prompt.length > 0 ? prompt : undefined,
      stylePresetCustom ?? undefined,
      paletteCustom ?? undefined,
      roomTypeCustom ?? undefined,
    ].filter((part): part is string => part !== undefined);

    await this.aiModerationService.moderateContent({
      text: textParts.length > 0 ? textParts.join("\n") : undefined,
      images: this.buildModerationImages({
        inputPhoto,
        inspirationPhoto,
        referencePhotos,
      }),
    });
  };

  private buildModerationImages = (params: {
    inputPhoto: TUploadedFile | undefined;
    inspirationPhoto: TUploadedFile | undefined;
    referencePhotos: TUploadedFile[];
  }): Array<{ base64: string; mediaType: string }> => {
    const { inputPhoto, inspirationPhoto, referencePhotos } = params;

    return [
      inputPhoto
        ? { base64: inputPhoto.buffer.toString("base64"), mediaType: inputPhoto.mimetype }
        : undefined,
      inspirationPhoto
        ? {
            base64: inspirationPhoto.buffer.toString("base64"),
            mediaType: inspirationPhoto.mimetype,
          }
        : undefined,
      ...referencePhotos.map((file) => ({
        base64: file.buffer.toString("base64"),
        mediaType: file.mimetype,
      })),
    ].filter((image): image is { base64: string; mediaType: string } => image !== undefined);
  };

  private hasHttpStatus = (params: { error: Error }): boolean => {
    const { error } = params;

    return "getStatus" in error;
  };
}

import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Types } from "mongoose";

import { AiGenerationService } from "@/modules/ai/services/ai-generation.service";
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
import { IterationPromptBuilderService } from "./iteration-prompt-builder.service";

type TCreateIterationParams = {
  visualization: TVisualizationDocument;
  userId: Types.ObjectId;
  prompt: string;
  inputPhoto: TUploadedFile | undefined;
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
    private readonly iterationPromptBuilderService: IterationPromptBuilderService,
    private readonly iterationAssetsService: IterationAssetsService,
    private readonly iterationCreditsService: IterationCreditsService,
    private readonly aiGenerationService: AiGenerationService,
    private readonly fileAssetsService: FileAssetsService,
    private readonly createIterationResponseMapper: CreateIterationResponseMapper,
  ) {
    this.visualizationImageModel = this.configService.getOrThrow<string>("visualizationImageModel");
  }

  createIteration = async (params: TCreateIterationParams) => {
    const { visualization, userId, prompt, inputPhoto, parentIterationId, referencePhotos } = params;

    const visualizationId = visualization._id.toString();
    const userIdStr = userId.toString();

    this.logger.log(
      `[createIteration] START visualizationId=${visualizationId} ` +
        `hasInputPhoto=${!!inputPhoto} parentIterationId=${parentIterationId ?? "none"} ` +
        `referencePhotosCount=${referencePhotos.length} hasPrompt=${!!prompt}`,
    );

    if (!inputPhoto && !parentIterationId) {
      throw toIterationOrchestrationHttpException({ code: "INVALID_INPUT" });
    }
    if (inputPhoto && parentIterationId) {
      throw toIterationOrchestrationHttpException({ code: "INVALID_INPUT" });
    }

    this.iterationFilesValidatorService.validateFiles({
      inputPhoto,
      referencePhotos,
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

    const builtPrompt = this.iterationPromptBuilderService.buildVisualizationPrompt({
      stylePreset: visualization.stylePreset,
      palette: visualization.palette,
      roomType: visualization.roomType,
      prompt,
      hasInputPhoto: isEditMode ? false : !!inputPhoto,
      hasReferencePhotos: referencePhotos.length > 0,
      hasPreviousOutput: isEditMode,
      isSubsequentIteration: isEditMode,
    });

    this.logger.log(`[createIteration] Prompt built isEditMode=${isEditMode}`);

    let creditReservation: TIterationCreditReservation | null = null;

    try {
      creditReservation = await this.iterationCreditsService.reserveCreditsForIteration({
        userId: userIdStr,
        visualizationId,
      });

      const allReferenceImages: Array<{ base64: string; mediaType: string }> = [];

      if (inputPhoto) {
        allReferenceImages.push({
          base64: inputPhoto.buffer.toString("base64"),
          mediaType: inputPhoto.mimetype,
        });
      }

      if (previousOutputImage) {
        allReferenceImages.push(previousOutputImage);
      }

      referencePhotos.forEach((file) => {
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

      const registeredAssetsBundle = await this.iterationAssetsService.uploadAssetsForIteration({
        userId: userIdStr,
        inputPhoto,
        referencePhotos,
        outputMediaType: generationResult.mediaType,
        outputBytes: generationResult.uint8Array,
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

  private hasHttpStatus = (params: { error: Error }): boolean => {
    const { error } = params;

    return "getStatus" in error;
  };
}

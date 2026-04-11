import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AiGenerationService } from "@/modules/ai/services/ai-generation.service";
import { toIterationOrchestrationHttpException } from "../../errors/iteration-orchestration.errors";
import { VisualizationsRepository } from "../../repositories/visualizations.repository";
import { type TCreateVisualizationIterationBody } from "../../visualizations.dto";
import { CreateIterationResponseMapper } from "../mappers/create-iteration-response.mapper";
import { IterationAccessService } from "./internal/iteration-access.service";
import { IterationAssetsService } from "./internal/iteration-assets.service";
import {
  IterationCreditsService,
  type TIterationCreditReservation,
} from "./internal/iteration-credits.service";
import { IterationFilesValidatorService } from "./internal/iteration-files-validator.service";
import type { TUploadedFile } from "./internal/iteration.types";
import { IterationPromptBuilderService } from "./iteration-prompt-builder.service";

type TCreateIterationParams = {
  clerkId: string;
  email: string;
  visualizationId: string;
  body: TCreateVisualizationIterationBody;
  inputPhoto: TUploadedFile | undefined;
  referencePhotos: TUploadedFile[];
};

type TBaseGenerationInput = {
  mode: "generation";
  stylePreset: string | null;
  colors: string[];
  roomType: string | null;
  prompt: string;
};

@Injectable()
export class CreateIterationService {
  private readonly visualizationImageModel: string;
  private readonly logger = new Logger(CreateIterationService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly iterationAccessService: IterationAccessService,
    private readonly iterationFilesValidatorService: IterationFilesValidatorService,
    private readonly visualizationsRepository: VisualizationsRepository,
    private readonly iterationPromptBuilderService: IterationPromptBuilderService,
    private readonly iterationAssetsService: IterationAssetsService,
    private readonly iterationCreditsService: IterationCreditsService,
    private readonly aiGenerationService: AiGenerationService,
    private readonly createIterationResponseMapper: CreateIterationResponseMapper,
  ) {
    this.visualizationImageModel = this.configService.getOrThrow<string>("visualizationImageModel");
  }

  createIteration = async (params: TCreateIterationParams) => {
    const { clerkId, email, visualizationId, body, inputPhoto, referencePhotos } = params;

    this.logger.log(
      `[createIteration] START visualizationId=${visualizationId} ` +
        `hasInputPhoto=${!!inputPhoto} referencePhotosCount=${referencePhotos.length} ` +
        `stylePreset=${body.stylePreset ?? "none"} palette=${body.palette ?? "none"} ` +
        `roomType=${body.roomType ?? "none"} hasPrompt=${!!body.prompt}`,
    );

    const user = await this.iterationAccessService.resolveAuthorizedUser({
      clerkId,
      email,
      visualizationId,
    });

    this.logger.log(`[createIteration] User resolved userId=${user._id.toString()}`);

    this.iterationFilesValidatorService.validateFiles({
      inputPhoto,
      referencePhotos,
    });

    const isEditMode = !!body.parentIterationId;

    const prompt = this.iterationPromptBuilderService.buildVisualizationPrompt({
      stylePreset: body.stylePreset,
      palette: body.palette,
      roomType: body.roomType,
      prompt: body.prompt,
      hasInputPhoto: isEditMode ? false : !!inputPhoto,
      hasReferencePhotos: referencePhotos.length > 0,
      hasPreviousOutput: isEditMode ? !!inputPhoto : false,
      isSubsequentIteration: isEditMode,
    });

    this.logger.log(`[createIteration] Prompt built isEditMode=${isEditMode}`);
    this.logger.debug(`[createIteration] Prompt content: ${prompt}`);

    const baseGenerationInput = this.buildBaseGenerationInput({ body });

    let creditReservation: TIterationCreditReservation | null = null;

    try {
      creditReservation = await this.iterationCreditsService.reserveCreditsForIteration({
        userId: user._id.toString(),
        visualizationId,
      });

      this.logger.log(
        `[createIteration] Credits reserved reservationId=${creditReservation.reservationId}`,
      );

      let generationResult: { mediaType: string; uint8Array: Uint8Array };

      const allReferenceImages: Array<{ base64: string; mediaType: string }> = [];

      if (inputPhoto) {
        allReferenceImages.push({
          base64: inputPhoto.buffer.toString("base64"),
          mediaType: inputPhoto.mimetype,
        });
        this.logger.log(
          `[createIteration] Added inputPhoto to reference images mimeType=${inputPhoto.mimetype} sizeBytes=${inputPhoto.buffer.byteLength}`,
        );
      }

      referencePhotos.forEach((file, index) => {
        allReferenceImages.push({
          base64: file.buffer.toString("base64"),
          mediaType: file.mimetype,
        });
        this.logger.log(
          `[createIteration] Added referencePhoto[${index}] to reference images mimeType=${file.mimetype} sizeBytes=${file.buffer.byteLength}`,
        );
      });

      this.logger.log(
        `[createIteration] Calling AI generation totalReferenceImages=${allReferenceImages.length} model=${this.visualizationImageModel}`,
      );

      try {
        generationResult = await this.aiGenerationService.generateImage({
          modelId: this.visualizationImageModel,
          prompt,
          referenceImages: allReferenceImages,
        });
        this.logger.log(
          `[createIteration] AI generation succeeded mediaType=${generationResult.mediaType} sizeBytes=${generationResult.uint8Array.byteLength}`,
        );
      } catch (err) {
        this.logger.error(
          `[createIteration] AI generation failed: ${err instanceof Error ? err.message : String(err)}`,
        );
        throw toIterationOrchestrationHttpException({ code: "UPSTREAM_GENERATION_FAILURE" });
      }

      const registeredAssetsBundle = await this.iterationAssetsService.uploadAssetsForIteration({
        userId: user._id.toString(),
        inputPhoto,
        referencePhotos,
        outputMediaType: generationResult.mediaType,
        outputBytes: generationResult.uint8Array,
      });

      this.logger.log(
        `[createIteration] Assets uploaded outputAssetId=${registeredAssetsBundle.outputAssetId} inputAssetId=${registeredAssetsBundle.inputAssetId} referenceAssetCount=${registeredAssetsBundle.referenceAssetIds.length}`,
      );

      const updatedVisualization =
        await this.visualizationsRepository.appendIterationForVisualizationForUser({
          userId: user._id,
          visualizationId,
          status: "succeeded",
          failureCode: null,
          baseIterationId: body.parentIterationId ?? null,
          generationInput: {
            ...baseGenerationInput,
            inputAsset: registeredAssetsBundle.inputAssetId,
            referenceAssets: registeredAssetsBundle.referenceAssetIds,
          },
          outputAsset: registeredAssetsBundle.outputAssetId,
          resultImageAssetId: registeredAssetsBundle.outputAssetId,
        });

      if (!updatedVisualization) {
        throw new NotFoundException("Visualization not found.");
      }

      const createdIteration =
        updatedVisualization.iterations[updatedVisualization.iterations.length - 1];
      const createdIterationId = createdIteration._id.toString();

      this.logger.log(
        `[createIteration] Iteration appended iterationId=${createdIterationId} iterationNo=${createdIteration.iterationNo}`,
      );

      await this.iterationCreditsService.consumeReservedCreditsForIteration({
        userId: user._id.toString(),
        visualizationId,
        reservationId: creditReservation.reservationId,
        mutationKey: creditReservation.mutationKey,
      });

      this.logger.log(
        `[createIteration] Credits consumed. SUCCESS iterationId=${createdIterationId}`,
      );

      return this.createIterationResponseMapper.map({
        visualizationDocument: updatedVisualization,
      });
    } catch (error) {
      await this.handleFailure({
        error,
        creditReservation,
        userId: user._id.toString(),
        visualizationId,
      });
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

  private buildBaseGenerationInput = (params: {
    body: TCreateVisualizationIterationBody;
  }): TBaseGenerationInput => {
    const { body } = params;

    return {
      mode: "generation",
      stylePreset: body.stylePreset ?? null,
      colors: body.palette ? [body.palette] : [],
      roomType: body.roomType ?? null,
      prompt: body.prompt ?? "",
    };
  };
}

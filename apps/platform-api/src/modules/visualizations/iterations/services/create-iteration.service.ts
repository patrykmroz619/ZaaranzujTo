import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Types } from "mongoose";

import { AiGenerationService } from "@/modules/ai/services/ai-generation.service";

import {
  toIterationOrchestrationHttpException,
  type TIterationOrchestrationErrorCode,
} from "../../errors/iteration-orchestration.errors";
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
import type { TRegisteredIterationAssetsBundle, TUploadedFile } from "./internal/iteration.types";
import { IterationPromptBuilderService } from "./iteration-prompt-builder.service";

type TCreateIterationParams = {
  clerkId: string;
  email: string;
  visualizationId: string;
  body: TCreateVisualizationIterationBody;
  inputPhoto: TUploadedFile;
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

    const user = await this.iterationAccessService.resolveAuthorizedUser({
      clerkId,
      email,
      visualizationId,
    });

    this.iterationFilesValidatorService.validateFiles({
      inputPhoto,
      referencePhotos,
    });

    const prompt = this.iterationPromptBuilderService.buildVisualizationPrompt({
      stylePreset: body.stylePreset,
      promptContext: body.promptContext,
    });

    const baseGenerationInput = this.buildBaseGenerationInput({
      body,
      prompt,
    });

    let creditReservation: TIterationCreditReservation | null = null;
    let registeredAssetsBundle: TRegisteredIterationAssetsBundle | null = null;

    try {
      creditReservation = await this.iterationCreditsService.reserveCreditsForIteration({
        userId: user._id.toString(),
        visualizationId,
      });

      let generationResult: { mediaType: string; uint8Array: Uint8Array };
      const referenceImages = referencePhotos.map((file) => ({
        base64: file.buffer.toString("base64"),
        mediaType: file.mimetype,
      }));

      try {
        generationResult = await this.aiGenerationService.generateImage({
          modelId: this.visualizationImageModel,
          prompt,
          referenceImages,
        });
      } catch {
        throw toIterationOrchestrationHttpException({ code: "UPSTREAM_GENERATION_FAILURE" });
      }

      registeredAssetsBundle = await this.iterationAssetsService.registerAssetsForIteration({
        userId: user._id.toString(),
        inputPhoto,
        referencePhotos,
        outputMediaType: generationResult.mediaType,
        outputSizeBytes: generationResult.uint8Array.byteLength,
      });

      const visualization =
        await this.visualizationsRepository.appendIterationForVisualizationForUser({
          userId: user._id,
          visualizationId,
          status: "succeeded",
          failureCode: null,
          generationInput: {
            ...baseGenerationInput,
            referenceAssets: registeredAssetsBundle.referenceAssetIds,
          },
          inputAssets: registeredAssetsBundle.inputAssets,
          outputAsset: registeredAssetsBundle.outputAsset,
          resultImageAssetId: registeredAssetsBundle.outputAssetId,
        });

      if (!visualization) {
        throw new NotFoundException("Visualization not found.");
      }

      const createdIteration = visualization.iterations[visualization.iterations.length - 1];
      const createdIterationId = createdIteration._id.toString();

      await this.iterationAssetsService.linkAssetsToIteration({
        userId: user._id.toString(),
        visualizationId,
        iterationId: createdIterationId,
        inputAssetId: registeredAssetsBundle.inputAssetId,
        referenceAssetIds: registeredAssetsBundle.referenceAssetIds,
        outputAssetId: registeredAssetsBundle.outputAssetId,
      });

      await this.iterationCreditsService.consumeReservedCreditsForIteration({
        userId: user._id.toString(),
        visualizationId,
        reservationId: creditReservation.reservationId,
        mutationKey: creditReservation.mutationKey,
      });

      return this.createIterationResponseMapper.map({
        visualizationDocument: visualization,
      });
    } catch (error) {
      await this.handleFailure({
        error,
        creditReservation,
        userId: user._id.toString(),
        userObjectId: user._id,
        visualizationId,
        baseGenerationInput,
        inputAssets: registeredAssetsBundle?.inputAssets ?? [],
        referenceAssetIds: registeredAssetsBundle?.referenceAssetIds ?? [],
      });
    }
  };

  private handleFailure = async (params: {
    error: unknown;
    creditReservation: TIterationCreditReservation | null;
    userId: string;
    userObjectId: Types.ObjectId;
    visualizationId: string;
    baseGenerationInput: TBaseGenerationInput;
    inputAssets: Array<{
      assetId: string;
      role: "input-primary" | "input-reference" | "output-generated";
      mimeType: string;
      sizeBytes: number;
    }>;
    referenceAssetIds: string[];
  }) => {
    const {
      error,
      creditReservation,
      userId,
      userObjectId,
      visualizationId,
      baseGenerationInput,
      inputAssets,
      referenceAssetIds,
    } = params;

    const failureCode = this.resolveFailureCode({ error });

    if (creditReservation) {
      await this.visualizationsRepository
        .appendIterationForVisualizationForUser({
          userId: userObjectId,
          visualizationId,
          status: "failed",
          failureCode,
          generationInput: {
            ...baseGenerationInput,
            referenceAssets: referenceAssetIds,
          },
          inputAssets,
          outputAsset: null,
          resultImageAssetId: null,
        })
        .catch(() => undefined);

      await this.iterationCreditsService
        .compensateReservedCreditsForIteration({
          userId,
          visualizationId,
          reservationId: creditReservation.reservationId,
        })
        .catch(() => undefined);
    }

    if (error instanceof NotFoundException) {
      throw error;
    }

    if (error instanceof Error && this.hasHttpStatus({ error })) {
      throw error;
    }

    throw toIterationOrchestrationHttpException({ code: "UPSTREAM_GENERATION_FAILURE" });
  };

  private hasHttpStatus = (params: { error: Error }): boolean => {
    const { error } = params;

    return "getStatus" in error;
  };

  private resolveFailureCode = (params: { error: unknown }): TIterationOrchestrationErrorCode => {
    const { error } = params;

    if (typeof error === "object" && error !== null && "getResponse" in error) {
      const response = (error as { getResponse: () => unknown }).getResponse();

      if (typeof response === "object" && response !== null && "code" in response) {
        const code = (response as { code?: unknown }).code;

        if (
          code === "INSUFFICIENT_CREDITS" ||
          code === "FILE_TOO_LARGE" ||
          code === "INVALID_INPUT" ||
          code === "UPSTREAM_GENERATION_FAILURE" ||
          code === "ACTIVE_GENERATION_CONFLICT"
        ) {
          return code;
        }
      }
    }

    return "UPSTREAM_GENERATION_FAILURE";
  };

  private buildBaseGenerationInput = (params: {
    body: TCreateVisualizationIterationBody;
    prompt: string;
  }): TBaseGenerationInput => {
    const { body, prompt } = params;

    return {
      mode: "generation",
      stylePreset: body.stylePreset ?? null,
      colors: [],
      roomType: this.getStringField({ value: body.promptContext?.["roomType"] }),
      prompt,
    };
  };

  private getStringField = (params: { value: unknown }): string | null => {
    const { value } = params;

    if (typeof value !== "string") {
      return null;
    }

    const normalized = value.trim();

    return normalized.length > 0 ? normalized : null;
  };
}

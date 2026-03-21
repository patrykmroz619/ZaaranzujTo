import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "node:crypto";

import { AiGenerationService } from "@/modules/ai/services/ai-generation.service";
import { CompensateCreditService } from "@/modules/credits/services/compensate-credit.service";
import { ConsumeCreditService } from "@/modules/credits/services/consume-credit.service";
import { ReserveCreditService } from "@/modules/credits/services/reserve-credit.service";
import { FileAssetsService } from "@/modules/storage/services/file-assets.service";
import { GetUserService } from "@/modules/users/services/get-user.service";

import { toIterationOrchestrationHttpException } from "../../errors/iteration-orchestration.errors";
import { VisualizationsRepository } from "../../repositories/visualizations.repository";
import { ValidateVisualizationOwnershipService } from "../../services/validate-visualization-ownership.service";
import {
  CREATE_ITERATION_ALLOWED_MIME_PREFIX,
  CREATE_ITERATION_MAX_FILE_SIZE_BYTES,
  type TCreateVisualizationIterationBody,
} from "../../visualizations.dto";
import { CreateIterationResponseMapper } from "../mappers/create-iteration-response.mapper";
import { IterationPromptBuilderService } from "./iteration-prompt-builder.service";

type TCreateIterationParams = {
  clerkId: string;
  email: string;
  visualizationId: string;
  body: TCreateVisualizationIterationBody;
  inputPhoto: TUploadedFile;
  referencePhotos: TUploadedFile[];
};

type TUploadedFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};
@Injectable()
export class CreateIterationService {
  private readonly visualizationImageModel: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly getUserService: GetUserService,
    private readonly validateVisualizationOwnershipService: ValidateVisualizationOwnershipService,
    private readonly visualizationsRepository: VisualizationsRepository,
    private readonly fileAssetsService: FileAssetsService,
    private readonly iterationPromptBuilderService: IterationPromptBuilderService,
    private readonly aiGenerationService: AiGenerationService,
    private readonly reserveCreditService: ReserveCreditService,
    private readonly consumeCreditService: ConsumeCreditService,
    private readonly compensateCreditService: CompensateCreditService,
    private readonly createIterationResponseMapper: CreateIterationResponseMapper,
  ) {
    this.visualizationImageModel = this.configService.getOrThrow<string>("visualizationImageModel");
  }

  createIteration = async (params: TCreateIterationParams) => {
    const { clerkId, email, visualizationId, body, inputPhoto, referencePhotos } = params;

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    await this.validateVisualizationOwnershipService.validate({
      userId: user._id,
      visualizationId,
    });

    this.validateFile({ file: inputPhoto });
    referencePhotos.forEach((file) => this.validateFile({ file }));

    const reservationId = randomUUID();
    let creditReserved = false;
    let failureCode: string | null = null;
    const registeredInputAssets: Array<{
      assetId: string;
      role: "input-primary" | "input-reference";
      mimeType: string;
      sizeBytes: number;
    }> = [];

    try {
      const creditMutationKey = randomUUID();

      await this.reserveCreditService.reserve({
        userId: user._id.toString(),
        amount: 1,
        reservationId,
        idempotencyKey: creditMutationKey,
        source: {
          module: "visualizations",
          entityId: visualizationId,
        },
      });
      creditReserved = true;

      const prompt = this.iterationPromptBuilderService.buildVisualizationPrompt({
        stylePreset: body.stylePreset,
        promptContext: body.promptContext,
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
        failureCode = "UPSTREAM_GENERATION_FAILURE";
        throw toIterationOrchestrationHttpException({ code: "UPSTREAM_GENERATION_FAILURE" });
      }

      const inputAsset = await this.fileAssetsService.registerFileAsset(
        user._id.toString(),
        `${user._id.toString()}/iterations/${randomUUID()}-${inputPhoto.originalname}`,
        inputPhoto.mimetype,
        inputPhoto.size,
      );

      registeredInputAssets.push({
        assetId: inputAsset._id.toString(),
        role: "input-primary",
        mimeType: inputAsset.mimeType,
        sizeBytes: inputAsset.sizeBytes,
      });

      const referenceAssets = await Promise.all(
        referencePhotos.map(async (file) =>
          this.fileAssetsService.registerFileAsset(
            user._id.toString(),
            `${user._id.toString()}/iterations/${randomUUID()}-${file.originalname}`,
            file.mimetype,
            file.size,
          ),
        ),
      );

      referenceAssets.forEach((asset) => {
        registeredInputAssets.push({
          assetId: asset._id.toString(),
          role: "input-reference",
          mimeType: asset.mimeType,
          sizeBytes: asset.sizeBytes,
        });
      });

      const outputAsset = await this.fileAssetsService.registerFileAsset(
        user._id.toString(),
        `${user._id.toString()}/iterations/${randomUUID()}.${this.getImageExtension({ mediaType: generationResult.mediaType })}`,
        generationResult.mediaType,
        Math.max(generationResult.uint8Array.byteLength, 1),
      );

      const visualization =
        await this.visualizationsRepository.appendIterationForVisualizationForUser({
          userId: user._id,
          visualizationId,
          status: "succeeded",
          failureCode: null,
          generationInput: {
            mode: "generation",
            stylePreset: body.stylePreset ?? null,
            colors: [],
            roomType: this.getStringField({ value: body.promptContext?.["roomType"] }),
            prompt,
            referenceAssets: referenceAssets.map((asset) => asset._id.toString()),
          },
          inputAssets: [...registeredInputAssets],
          outputAsset: {
            assetId: outputAsset._id.toString(),
            role: "output-generated",
            mimeType: outputAsset.mimeType,
            sizeBytes: outputAsset.sizeBytes,
          },
          resultImageAssetId: outputAsset._id.toString(),
        });

      if (!visualization) {
        throw new NotFoundException("Visualization not found.");
      }

      const createdIteration = visualization.iterations[visualization.iterations.length - 1];
      const createdIterationId = createdIteration._id.toString();

      await this.fileAssetsService.linkAssetToIteration({
        assetId: inputAsset._id.toString(),
        userId: user._id.toString(),
        visualizationId,
        iterationId: createdIterationId,
        assetRole: "input-primary",
      });

      await Promise.all(
        referenceAssets.map((asset) =>
          this.fileAssetsService.linkAssetToIteration({
            assetId: asset._id.toString(),
            userId: user._id.toString(),
            visualizationId,
            iterationId: createdIterationId,
            assetRole: "input-reference",
          }),
        ),
      );

      await this.fileAssetsService.linkAssetToIteration({
        assetId: outputAsset._id.toString(),
        userId: user._id.toString(),
        visualizationId,
        iterationId: createdIterationId,
        assetRole: "output-generated",
      });

      await this.consumeCreditService.consume({
        userId: user._id.toString(),
        reservationId,
        idempotencyKey: creditMutationKey,
        source: {
          module: "visualizations",
          entityId: visualizationId,
        },
      });

      return this.createIterationResponseMapper.map({
        visualizationDocument: visualization,
      });
    } catch (error) {
      if (creditReserved) {
        failureCode = failureCode ?? "UPSTREAM_GENERATION_FAILURE";

        await this.visualizationsRepository
          .appendIterationForVisualizationForUser({
            userId: user._id,
            visualizationId,
            status: "failed",
            failureCode,
            generationInput: {
              mode: "generation",
              stylePreset: body.stylePreset ?? null,
              colors: [],
              roomType: this.getStringField({ value: body.promptContext?.["roomType"] }),
              prompt: this.iterationPromptBuilderService.buildVisualizationPrompt({
                stylePreset: body.stylePreset,
                promptContext: body.promptContext,
              }),
              referenceAssets: registeredInputAssets
                .filter((asset) => asset.role === "input-reference")
                .map((asset) => asset.assetId),
            },
            inputAssets: registeredInputAssets,
            outputAsset: null,
            resultImageAssetId: null,
          })
          .catch(() => undefined);

        await this.compensateCreditService
          .compensate({
            userId: user._id.toString(),
            reservationId,
            reason: "iteration_generation_failed",
            idempotencyKey: randomUUID(),
            source: {
              module: "visualizations",
              entityId: visualizationId,
            },
          })
          .catch(() => undefined);
      }

      if (
        error instanceof NotFoundException ||
        (typeof error === "object" && error !== null && "getStatus" in error)
      ) {
        throw error;
      }

      throw toIterationOrchestrationHttpException({ code: "UPSTREAM_GENERATION_FAILURE" });
    }
  };

  private validateFile = (params: { file: TUploadedFile }) => {
    const { file } = params;

    if (!file.mimetype.startsWith(CREATE_ITERATION_ALLOWED_MIME_PREFIX)) {
      throw toIterationOrchestrationHttpException({ code: "INVALID_INPUT" });
    }

    if (file.size > CREATE_ITERATION_MAX_FILE_SIZE_BYTES) {
      throw toIterationOrchestrationHttpException({ code: "FILE_TOO_LARGE" });
    }
  };

  private getStringField = (params: { value: unknown }): string | null => {
    const { value } = params;

    if (typeof value !== "string") {
      return null;
    }

    const normalized = value.trim();

    return normalized.length > 0 ? normalized : null;
  };

  private getImageExtension = (params: { mediaType: string }): string => {
    const { mediaType } = params;

    if (mediaType === "image/png") {
      return "png";
    }

    if (mediaType === "image/jpeg") {
      return "jpg";
    }

    if (mediaType === "image/webp") {
      return "webp";
    }

    if (mediaType === "image/avif") {
      return "avif";
    }

    return "img";
  };
}

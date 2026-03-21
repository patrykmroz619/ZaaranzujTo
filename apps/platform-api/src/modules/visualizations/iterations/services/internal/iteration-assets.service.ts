import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

import { FileAssetsService } from "@/modules/storage/services/file-assets.service";

import type {
  TInputIterationAsset,
  TRegisteredIterationAssetsBundle,
  TUploadedFile,
} from "./iteration.types";

type TRegisterAssetsForIterationParams = {
  userId: string;
  inputPhoto: TUploadedFile;
  referencePhotos: TUploadedFile[];
  outputMediaType: string;
  outputSizeBytes: number;
};

type TLinkAssetsToIterationParams = {
  userId: string;
  visualizationId: string;
  iterationId: string;
  inputAssetId: string;
  referenceAssetIds: string[];
  outputAssetId: string;
};

@Injectable()
export class IterationAssetsService {
  constructor(private readonly fileAssetsService: FileAssetsService) {}

  registerAssetsForIteration = async (
    params: TRegisterAssetsForIterationParams,
  ): Promise<TRegisteredIterationAssetsBundle> => {
    const { userId, inputPhoto, referencePhotos, outputMediaType, outputSizeBytes } = params;

    const inputAsset = await this.fileAssetsService.registerFileAsset(
      userId,
      `${userId}/iterations/${randomUUID()}-${inputPhoto.originalname}`,
      inputPhoto.mimetype,
      inputPhoto.size,
    );

    const inputAssets: TInputIterationAsset[] = [
      {
        assetId: inputAsset._id.toString(),
        role: "input-primary",
        mimeType: inputAsset.mimeType,
        sizeBytes: inputAsset.sizeBytes,
      },
    ];

    const referenceAssets = await Promise.all(
      referencePhotos.map(async (file) =>
        this.fileAssetsService.registerFileAsset(
          userId,
          `${userId}/iterations/${randomUUID()}-${file.originalname}`,
          file.mimetype,
          file.size,
        ),
      ),
    );

    referenceAssets.forEach((asset) => {
      inputAssets.push({
        assetId: asset._id.toString(),
        role: "input-reference",
        mimeType: asset.mimeType,
        sizeBytes: asset.sizeBytes,
      });
    });

    const outputAsset = await this.fileAssetsService.registerFileAsset(
      userId,
      `${userId}/iterations/${randomUUID()}.${this.getImageExtension({ mediaType: outputMediaType })}`,
      outputMediaType,
      Math.max(outputSizeBytes, 1),
    );

    return {
      inputAssetId: inputAsset._id.toString(),
      referenceAssetIds: referenceAssets.map((asset) => asset._id.toString()),
      outputAssetId: outputAsset._id.toString(),
      inputAssets,
      outputAsset: {
        assetId: outputAsset._id.toString(),
        role: "output-generated",
        mimeType: outputAsset.mimeType,
        sizeBytes: outputAsset.sizeBytes,
      },
    };
  };

  linkAssetsToIteration = async (params: TLinkAssetsToIterationParams) => {
    const { userId, visualizationId, iterationId, inputAssetId, referenceAssetIds, outputAssetId } =
      params;

    await this.fileAssetsService.linkAssetToIteration({
      assetId: inputAssetId,
      userId,
      visualizationId,
      iterationId,
      assetRole: "input-primary",
    });

    await Promise.all(
      referenceAssetIds.map((assetId) =>
        this.fileAssetsService.linkAssetToIteration({
          assetId,
          userId,
          visualizationId,
          iterationId,
          assetRole: "input-reference",
        }),
      ),
    );

    await this.fileAssetsService.linkAssetToIteration({
      assetId: outputAssetId,
      userId,
      visualizationId,
      iterationId,
      assetRole: "output-generated",
    });
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

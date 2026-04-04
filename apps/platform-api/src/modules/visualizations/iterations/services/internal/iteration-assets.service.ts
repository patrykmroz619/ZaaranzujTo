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
  inputPhoto: TUploadedFile | undefined;
  referencePhotos: TUploadedFile[];
  outputMediaType: string;
  outputBytes: Uint8Array;
};

type TLinkAssetsToIterationParams = {
  userId: string;
  visualizationId: string;
  iterationId: string;
  inputAssetId: string | null;
  referenceAssetIds: string[];
  outputAssetId: string;
};

@Injectable()
export class IterationAssetsService {
  constructor(private readonly fileAssetsService: FileAssetsService) {}

  registerAssetsForIteration = async (
    params: TRegisterAssetsForIterationParams,
  ): Promise<TRegisteredIterationAssetsBundle> => {
    const { userId, inputPhoto, referencePhotos, outputMediaType, outputBytes } = params;

    const inputAssets: TInputIterationAsset[] = [];
    let inputAssetId: string | null = null;

    if (inputPhoto) {
      const key = `${userId}/iterations/${randomUUID()}-${inputPhoto.originalname}`;
      const inputAsset = await this.fileAssetsService.registerFileAsset(
        userId,
        key,
        inputPhoto.mimetype,
        inputPhoto.size,
      );
      await this.fileAssetsService.uploadFileAsset(key, inputPhoto.buffer, inputPhoto.mimetype);
      inputAssetId = inputAsset._id.toString();
      inputAssets.push({
        assetId: inputAsset._id.toString(),
        role: "input-primary",
        mimeType: inputAsset.mimeType,
        sizeBytes: inputAsset.sizeBytes,
      });
    }

    const referenceAssets = await Promise.all(
      referencePhotos.map(async (file) => {
        const key = `${userId}/iterations/${randomUUID()}-${file.originalname}`;
        const asset = await this.fileAssetsService.registerFileAsset(
          userId,
          key,
          file.mimetype,
          file.size,
        );
        await this.fileAssetsService.uploadFileAsset(key, file.buffer, file.mimetype);
        return asset;
      }),
    );

    referenceAssets.forEach((asset) => {
      inputAssets.push({
        assetId: asset._id.toString(),
        role: "input-reference",
        mimeType: asset.mimeType,
        sizeBytes: asset.sizeBytes,
      });
    });

    const outputKey = `${userId}/iterations/${randomUUID()}.${this.getImageExtension({ mediaType: outputMediaType })}`;
    const outputAsset = await this.fileAssetsService.registerFileAsset(
      userId,
      outputKey,
      outputMediaType,
      Math.max(outputBytes.byteLength, 1),
    );
    await this.fileAssetsService.uploadFileAsset(outputKey, outputBytes, outputMediaType);

    return {
      inputAssetId,
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

    if (inputAssetId) {
      await this.fileAssetsService.linkAssetToIteration({
        assetId: inputAssetId,
        userId,
        visualizationId,
        iterationId,
        assetRole: "input-primary",
      });
    }

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

import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

import { FileAssetsService } from "@/modules/storage/services/file-assets.service";

import type { TUploadedIterationAssetsBundle, TUploadedFile } from "./iteration.types";

type TUploadAssetsForIterationParams = {
  userId: string;
  inputPhoto: TUploadedFile | undefined;
  inspirationPhoto: TUploadedFile | undefined;
  referencePhotos: TUploadedFile[];
  outputMediaType: string;
  outputBytes: Uint8Array;
};

@Injectable()
export class IterationAssetsService {
  constructor(private readonly fileAssetsService: FileAssetsService) {}

  uploadAssetsForIteration = async (
    params: TUploadAssetsForIterationParams,
  ): Promise<TUploadedIterationAssetsBundle> => {
    const { userId, inputPhoto, inspirationPhoto, referencePhotos, outputMediaType, outputBytes } =
      params;

    let inputAssetId: string | null = null;
    let inspirationAssetId: string | null = null;

    const randomId = randomUUID();

    if (inputPhoto) {
      const key = `${userId}/iterations/${randomId}/input-photo`;
      const asset = await this.fileAssetsService.uploadAsset({
        userId,
        key,
        buffer: inputPhoto.buffer,
        mimeType: inputPhoto.mimetype,
      });
      inputAssetId = asset._id.toString();
    }

    if (inspirationPhoto) {
      const key = `${userId}/iterations/${randomId}/inspiration-photo`;
      const asset = await this.fileAssetsService.uploadAsset({
        userId,
        key,
        buffer: inspirationPhoto.buffer,
        mimeType: inspirationPhoto.mimetype,
      });
      inspirationAssetId = asset._id.toString();
    }

    const referenceAssets = await Promise.all(
      referencePhotos.map(async (file, index) => {
        const key = `${userId}/iterations/${randomId}/reference-photo-${index + 1}`;
        return this.fileAssetsService.uploadAsset({
          userId,
          key,
          buffer: file.buffer,
          mimeType: file.mimetype,
        });
      }),
    );

    const outputKey = `${userId}/iterations/${randomId}/output`;
    const outputAsset = await this.fileAssetsService.uploadAsset({
      userId,
      key: outputKey,
      buffer: outputBytes,
      mimeType: outputMediaType,
    });

    return {
      inputAssetId,
      inspirationAssetId,
      referenceAssetIds: referenceAssets.map((asset) => asset._id.toString()),
      outputAssetId: outputAsset._id.toString(),
    };
  };
}

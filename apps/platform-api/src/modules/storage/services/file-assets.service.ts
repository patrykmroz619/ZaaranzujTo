import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { FileAssetsRepository } from "../repositories/file-assets.repository";
import { CloudStorageService } from "./cloud-storage.service";

@Injectable()
export class FileAssetsService {
  constructor(
    private readonly fileAssetsRepository: FileAssetsRepository,
    private readonly cloudStorageService: CloudStorageService,
  ) {}

  async generateDownloadUrl(assetId: string, userId: string) {
    const asset = await this.fileAssetsRepository.findById(assetId);

    if (!asset) {
      throw new NotFoundException("File asset not found");
    }

    if (asset.userId !== userId) {
      throw new ForbiddenException("You do not have permission to access this file");
    }

    const expiresInSeconds = 3600;
    const downloadUrl = await this.cloudStorageService.getSignedDownloadUrl(
      asset.key,
      expiresInSeconds,
    );

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds);

    return { downloadUrl, expiresAt };
  }

  async registerFileAsset(userId: string, key: string, mimeType: string, sizeBytes: number) {
    return this.fileAssetsRepository.create({
      userId,
      key,
      mimeType,
      sizeBytes,
    });
  }

  async getFileAsset(assetId: string, userId: string) {
    const asset = await this.fileAssetsRepository.findByIdAndUser(assetId, userId);

    if (!asset) {
      throw new NotFoundException("File asset not found");
    }

    return asset;
  }
}

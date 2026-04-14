import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { FileAssetsRepository } from "../repositories/file-assets.repository";
import { CloudStorageService } from "./cloud-storage.service";
import { GetUserService } from "@/modules/users/services/get-user.service";

@Injectable()
export class FileAssetsService {
  constructor(
    private readonly fileAssetsRepository: FileAssetsRepository,
    private readonly cloudStorageService: CloudStorageService,
    private readonly getUserService: GetUserService,
  ) {}

  async generateDownloadUrl(assetId: string, userId: string, email: string) {
    const asset = await this.fileAssetsRepository.findById(assetId);

    const user = await this.getUserService.getUser({
      clerkId: userId,
      email,
    });

    if (!asset) {
      throw new NotFoundException("File asset not found");
    }

    if (asset.userId !== user.id) {
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

  async uploadAsset(params: {
    userId: string;
    key: string;
    buffer: Buffer | Uint8Array;
    mimeType: string;
  }) {
    const { userId, key, buffer, mimeType } = params;

    await this.cloudStorageService.uploadFile(key, buffer, mimeType);

    return this.fileAssetsRepository.create({
      userId,
      key,
      mimeType,
      sizeBytes: Math.max(buffer.byteLength, 1),
    });
  }

  async getFileAsset(assetId: string, userId: string) {
    const asset = await this.fileAssetsRepository.findByIdAndUser(assetId, userId);

    if (!asset) {
      throw new NotFoundException("File asset not found");
    }

    return asset;
  }

  async downloadAssetBuffer(params: {
    assetId: string;
    userId: string;
  }): Promise<{ buffer: Buffer; mimeType: string }> {
    const { assetId, userId } = params;

    const asset = await this.fileAssetsRepository.findByIdAndUser(assetId, userId);

    if (!asset) {
      throw new NotFoundException("File asset not found");
    }

    const { buffer, contentType } = await this.cloudStorageService.downloadFile(asset.key);

    return { buffer, mimeType: contentType || asset.mimeType };
  }

  async getAssetForDownload(params: {
    assetId: string;
    userId: string;
    email: string;
  }): Promise<{ buffer: Buffer; mimeType: string; sizeBytes: number; filename: string }> {
    const { assetId, userId, email } = params;

    const user = await this.getUserService.getUser({
      clerkId: userId,
      email,
    });

    const asset = await this.fileAssetsRepository.findByIdAndUser(assetId, user.id);

    if (!asset) {
      throw new NotFoundException("File asset not found");
    }

    const { buffer, contentType } = await this.cloudStorageService.downloadFile(asset.key);

    const filename = asset.key.split("/").pop() || asset._id.toString();

    return {
      buffer,
      mimeType: contentType || asset.mimeType,
      sizeBytes: asset.sizeBytes,
      filename,
    };
  }
}

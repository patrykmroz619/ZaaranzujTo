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

  async registerFileAsset(userId: string, key: string, mimeType: string, sizeBytes: number) {
    return this.fileAssetsRepository.create({
      userId,
      key,
      mimeType,
      sizeBytes,
    });
  }

  async uploadFileAsset(key: string, body: Buffer | Uint8Array, contentType: string): Promise<void> {
    await this.cloudStorageService.uploadFile(key, body, contentType);
  }

  async getFileAsset(assetId: string, userId: string) {
    const asset = await this.fileAssetsRepository.findByIdAndUser(assetId, userId);

    if (!asset) {
      throw new NotFoundException("File asset not found");
    }

    return asset;
  }

  async linkAssetToIteration(params: {
    assetId: string;
    userId: string;
    visualizationId: string;
    iterationId: string;
    assetRole: "input-primary" | "input-reference" | "output-generated";
  }) {
    const { assetId, userId, visualizationId, iterationId, assetRole } = params;

    const updatedAsset = await this.fileAssetsRepository.linkAssetContext({
      assetId,
      userId,
      visualizationId,
      iterationId,
      assetRole,
    });

    if (!updatedAsset) {
      throw new NotFoundException("File asset not found");
    }

    return updatedAsset;
  }
}

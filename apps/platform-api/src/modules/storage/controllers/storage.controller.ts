import { Controller, Get, Param, StreamableFile, UseGuards } from "@nestjs/common";

import { TSignedUrlResponse, TFileAssetResponse } from "@repo/contracts/storage";
import { AuthGuard, CurrentUser, type TAuthData } from "@/shared/auth";

import { FileAssetsService } from "../services/file-assets.service";

@UseGuards(AuthGuard)
@Controller("storage")
export class StorageController {
  constructor(private readonly fileAssetsService: FileAssetsService) {}

  @Get("assets/:id/download")
  async downloadAsset(
    @Param("id") assetId: string,
    @CurrentUser() user: TAuthData,
  ): Promise<StreamableFile> {
    const { buffer, mimeType, sizeBytes, filename } =
      await this.fileAssetsService.getAssetForDownload({
        assetId,
        userId: user.userId,
        email: user.email,
      });

    return new StreamableFile(buffer, {
      type: mimeType,
      disposition: `attachment; filename="${filename}"`,
      length: sizeBytes,
    });
  }

  @Get("assets/:id/download-url")
  async getDownloadUrl(
    @Param("id") assetId: string,
    @CurrentUser() user: TAuthData,
  ): Promise<TSignedUrlResponse> {
    const { downloadUrl, expiresAt } = await this.fileAssetsService.generateDownloadUrl(
      assetId,
      user.userId,
      user.email,
    );

    return {
      downloadUrl,
      expiresAt: expiresAt.toISOString(),
    };
  }

  @Get("assets/:id")
  async getFileAsset(
    @Param("id") assetId: string,
    @CurrentUser() user: TAuthData,
  ): Promise<TFileAssetResponse> {
    const asset = await this.fileAssetsService.getFileAsset(assetId, user.userId);

    return {
      id: asset._id.toString(),
      mimeType: asset.mimeType,
      sizeBytes: asset.sizeBytes,
      createdAt: asset.createdAt.toISOString(),
    };
  }
}

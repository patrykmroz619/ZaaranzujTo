import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FileAsset, FileAssetSchema } from "./schemas/file-asset.schema";
import { FileAssetsRepository } from "./repositories/file-assets.repository";
import { CloudStorageService } from "./services/cloud-storage.service";
import { FileAssetsService } from "./services/file-assets.service";
import { StorageController } from "./controllers/storage.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FileAsset.name, schema: FileAssetSchema }]),
    UsersModule,
  ],
  controllers: [StorageController],
  providers: [FileAssetsRepository, CloudStorageService, FileAssetsService],
  exports: [FileAssetsService], // Exporting service for other modules
})
export class StorageModule {}

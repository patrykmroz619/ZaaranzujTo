import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FileAsset, FileAssetDocument } from "../schemas/file-asset.schema";

@Injectable()
export class FileAssetsRepository {
  constructor(
    @InjectModel(FileAsset.name) private readonly fileAssetModel: Model<FileAssetDocument>,
  ) {}

  async create(data: Partial<FileAsset>): Promise<FileAssetDocument> {
    const createdAsset = new this.fileAssetModel(data);
    return createdAsset.save();
  }

  async findByIdAndUser(id: string, userId: string): Promise<FileAssetDocument | null> {
    return this.fileAssetModel.findOne({ _id: id, userId }).exec();
  }

  async findById(id: string): Promise<FileAssetDocument | null> {
    return this.fileAssetModel.findById(id).exec();
  }

}

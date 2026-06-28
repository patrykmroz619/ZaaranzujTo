import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FileAssetDocument = FileAsset & Document & { createdAt: Date; updatedAt: Date };

@Schema({ collection: "file_assets", timestamps: true })
export class FileAsset {
  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: String, required: true, unique: true })
  key: string;

  @Prop({ type: String, required: true })
  mimeType: string;

  @Prop({ type: Number, required: true })
  sizeBytes: number;
}

export const FileAssetSchema = SchemaFactory.createForClass(FileAsset);

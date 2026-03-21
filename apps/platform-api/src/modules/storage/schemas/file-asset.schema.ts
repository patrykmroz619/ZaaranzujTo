import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FileAssetDocument = FileAsset & Document;

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

  @Prop({ type: String, required: false, default: null })
  visualizationId: string | null;

  @Prop({ type: String, required: false, default: null })
  iterationId: string | null;

  @Prop({ type: String, required: false, default: null })
  assetRole: "input-primary" | "input-reference" | "output-generated" | null;
}

export const FileAssetSchema = SchemaFactory.createForClass(FileAsset);

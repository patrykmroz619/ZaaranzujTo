import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, SortOrder, Types } from "mongoose";

export type TVisualizationMode = "fromPhoto" | "fromScratch";
export type TListProjectVisualizationsSort =
  | "updatedAt:desc"
  | "updatedAt:asc"
  | "createdAt:desc"
  | "createdAt:asc"
  | "name:asc"
  | "name:desc";
export type TListVisualizationIterationsSort = "iterationNo:asc" | "iterationNo:desc";

export type TVisualizationDocument = HydratedDocument<Visualization>;

@Schema({ _id: false })
export class LatestIterationSnapshot {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  iterationNo: number;

  @Prop({ required: true })
  imageAssetId: string;

  @Prop({ required: true })
  createdAt: Date;
}

const LatestIterationSnapshotSchema = SchemaFactory.createForClass(LatestIterationSnapshot);

@Schema({ _id: false })
export class IterationInput {
  @Prop({ required: true })
  mode: string;

  @Prop({ required: false, default: null })
  stylePreset: string | null;

  @Prop({ type: [String], required: true, default: [] })
  colors: string[];

  @Prop({ required: false, default: null })
  roomType: string | null;

  @Prop({ required: false, default: null })
  prompt: string | null;

  @Prop({ type: [String], required: true, default: [] })
  referenceAssets: string[];
}

const IterationInputSchema = SchemaFactory.createForClass(IterationInput);

@Schema({ _id: false })
export class IterationResult {
  @Prop({ required: false, default: null })
  imageAssetId: string | null;
}

const IterationResultSchema = SchemaFactory.createForClass(IterationResult);

@Schema({ _id: false })
export class IterationAssetRef {
  @Prop({ required: true })
  assetId: string;

  @Prop({ required: true })
  role: "input-primary" | "input-reference" | "output-generated";

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  sizeBytes: number;
}

const IterationAssetRefSchema = SchemaFactory.createForClass(IterationAssetRef);

@Schema({ _id: true })
export class Iteration {
  _id: Types.ObjectId;

  @Prop({ required: true })
  iterationNo: number;

  @Prop({ required: false, default: null })
  baseIterationId: string | null;

  @Prop({ required: true })
  status: string;

  @Prop({ required: false, default: null })
  failureCode: string | null;

  @Prop({ required: true, type: IterationInputSchema })
  generationInput: IterationInput;

  @Prop({ required: true, type: [IterationAssetRefSchema], default: [] })
  inputAssets: IterationAssetRef[];

  @Prop({ required: false, type: IterationAssetRefSchema, default: null })
  outputAsset: IterationAssetRef | null;

  @Prop({ required: true, type: IterationResultSchema })
  result: IterationResult;

  @Prop({ required: true })
  createdAt: Date;
}

const IterationSchema = SchemaFactory.createForClass(Iteration);

@Schema({ collection: "visualizations", timestamps: true })
export class Visualization {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 120 })
  name: string;

  @Prop({ required: true, enum: ["fromPhoto", "fromScratch"] })
  mode: TVisualizationMode;

  @Prop({ required: false, default: null })
  inputRoomPhotoAssetId: string | null;

  @Prop({ type: [IterationSchema], required: true, default: [] })
  iterations: Iteration[];

  @Prop({ required: true, default: 0 })
  iterationsCount: number;

  @Prop({ type: LatestIterationSnapshotSchema, required: false, default: null })
  latestIteration: LatestIterationSnapshot | null;

  createdAt: Date;
  updatedAt: Date;
}

export const VisualizationSchema = SchemaFactory.createForClass(Visualization);

VisualizationSchema.index({ userId: 1, projectId: 1, updatedAt: -1 });
VisualizationSchema.index({ userId: 1, _id: 1 });

export const visualizationSortMapping: Record<
  TListProjectVisualizationsSort,
  { [key: string]: SortOrder }
> = {
  "updatedAt:desc": { updatedAt: -1 },
  "updatedAt:asc": { updatedAt: 1 },
  "createdAt:desc": { createdAt: -1 },
  "createdAt:asc": { createdAt: 1 },
  "name:asc": { name: 1 },
  "name:desc": { name: -1 },
};

export const iterationSortMapping: Record<TListVisualizationIterationsSort, 1 | -1> = {
  "iterationNo:asc": 1,
  "iterationNo:desc": -1,
};

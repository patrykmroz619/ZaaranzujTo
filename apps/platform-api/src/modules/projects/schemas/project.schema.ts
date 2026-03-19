import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, Types } from "mongoose";

export type TProjectDocument = HydratedDocument<Project>;

@Schema({ collection: "projects", timestamps: true })
export class Project {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 120 })
  name: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ userId: 1, createdAt: -1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type TUserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ required: true })
  clerkId: string;

  @Prop({ required: true })
  email: string;

  @Prop({
    type: {
      nickname: { type: String, required: true },
    },
    required: true,
  })
  profile: {
    nickname: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ clerkId: 1 }, { unique: true });

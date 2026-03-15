import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";

import { User, type TUserDocument } from "./user.schema";

type TGetOrProvisionByClerkIdParams = {
  clerkId: string;
  email: string;
};

type TUpdateProfileByClerkIdParams = {
  clerkId: string;
  profilePatch: {
    nickname?: string;
  };
};

const deriveDefaultNickname = ({ email }: { email: string }) => {
  const localPart = email.split("@")[0]?.trim();
  if (localPart && localPart.length > 0) return localPart;
  return "User";
};

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getOrProvisionByClerkId(params: TGetOrProvisionByClerkIdParams): Promise<TUserDocument> {
    const { clerkId, email } = params;

    const fallbackNickname = deriveDefaultNickname({ email });

    const existingUser = await this.userModel.findOne({ clerkId });

    if (existingUser) {
      let shouldSave = false;

      if (existingUser.email !== email) {
        existingUser.email = email;
        shouldSave = true;
      }

      const currentNickname = existingUser.profile?.nickname;

      if (!currentNickname || currentNickname.trim().length === 0) {
        existingUser.profile = {
          ...(existingUser.profile ?? {}),
          nickname: fallbackNickname,
        };
        shouldSave = true;
      }

      if (shouldSave) {
        await existingUser.save();
      }

      return existingUser;
    }

    return await this.userModel.create({
      clerkId,
      email,
      profile: { nickname: fallbackNickname },
    });
  }

  updateProfileByClerkId = async (
    params: TUpdateProfileByClerkIdParams,
  ): Promise<TUserDocument> => {
    const { clerkId, profilePatch } = params;
    const update: Record<string, string> = {};

    if (profilePatch.nickname !== undefined) {
      update["profile.nickname"] = profilePatch.nickname;
    }

    if (Object.keys(update).length === 0) {
      const existingUser = await this.userModel.findOne({ clerkId });
      if (!existingUser) throw new Error("User not found.");
      return existingUser;
    }

    const updatedUser = await this.userModel.findOneAndUpdate(
      { clerkId },
      { $set: update },
      { returnDocument: "after" },
    );

    if (!updatedUser) throw new Error("User not found.");

    return updatedUser;
  };
}

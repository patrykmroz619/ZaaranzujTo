import { Injectable } from "@nestjs/common";
import { meResponseSchema, type TUpdateMeProfileRequest } from "@repo/contracts/me";

import { GetUserService } from "../../users/services/get-user.service";
import { UpdateUserProfileService } from "../../users/services/update-user-profile.service";
import { UpdateProfileDto } from "../profile.dto";

type TUpdateMeProfileParams = {
  clerkId: string;
  email: string;
  body: UpdateProfileDto;
};

@Injectable()
export class UpdateMeProfileService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly updateUserProfileService: UpdateUserProfileService,
  ) {}

  updateMeProfile = async (params: TUpdateMeProfileParams) => {
    const { clerkId, email, body } = params;

    const patch = body as TUpdateMeProfileRequest;

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    let updatedUser = user;

    if (patch.nickname !== undefined) {
      updatedUser = await this.updateUserProfileService.updateUserProfile({
        clerkId,
        profilePatch: {
          nickname: patch.nickname,
        },
      });
    }

    return meResponseSchema.parse({
      userId: clerkId,
      email: updatedUser.email,
      profile: {
        nickname: updatedUser.profile.nickname,
      },
    });
  };
}

import { Injectable } from "@nestjs/common";
import {
  meResponseSchema,
  type TMeResponse,
  type TUpdateMeProfileRequest,
} from "@repo/contracts/me";

import { UsersRepository } from "../../users/users.repository";
import { UpdateProfileDto } from "../profile.dto";

type TUpdateMeProfileParams = {
  clerkId: string;
  email: string;
  body: UpdateProfileDto;
};

@Injectable()
export class UpdateMeProfileService {
  constructor(private readonly usersRepository: UsersRepository) {}

  updateMeProfile = async (params: TUpdateMeProfileParams): Promise<TMeResponse> => {
    const { clerkId, email, body } = params;

    const patch = body as TUpdateMeProfileRequest;

    const user = await this.usersRepository.getOrProvisionByClerkId({
      clerkId,
      email,
    });

    let updatedUser = user;

    if (patch.nickname !== undefined) {
      updatedUser = await this.usersRepository.updateProfileByClerkId({
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

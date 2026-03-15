import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../users.repository";

type TUpdateUserProfileParams = {
  clerkId: string;
  profilePatch: {
    nickname?: string;
  };
};

@Injectable()
export class UpdateUserProfileService {
  constructor(private readonly usersRepository: UsersRepository) {}

  updateUserProfile = async (params: TUpdateUserProfileParams) => {
    const { clerkId, profilePatch } = params;

    return await this.usersRepository.updateProfileByClerkId({
      clerkId,
      profilePatch,
    });
  };
}

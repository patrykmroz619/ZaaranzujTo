import { Injectable } from "@nestjs/common";
import { meResponseSchema, type TMeResponse } from "@repo/contracts/me";

import { UsersRepository } from "../users/users.repository";

type TGetMeProfileInput = {
  clerkId: string;
  email: string;
};

@Injectable()
export class MeProfileService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getMeProfile = async (input: TGetMeProfileInput): Promise<TMeResponse> => {
    const { clerkId, email } = input;

    const user = await this.usersRepository.getOrProvisionByClerkId({
      clerkId,
      email,
    });

    return meResponseSchema.parse({
      userId: clerkId,
      email: user.email,
      profile: {
        nickname: user.profile.nickname,
      },
    });
  };
}

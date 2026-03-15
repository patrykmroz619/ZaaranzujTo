import { Injectable } from "@nestjs/common";
import { meResponseSchema } from "@repo/contracts/me";

import { GetUserService } from "../../users/services/get-user.service";

type TGetMeProfileParams = {
  clerkId: string;
  email: string;
};

@Injectable()
export class MeProfileService {
  constructor(private readonly getUserService: GetUserService) {}

  getMeProfile = async (params: TGetMeProfileParams) => {
    const { clerkId, email } = params;

    const user = await this.getUserService.getUser({
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

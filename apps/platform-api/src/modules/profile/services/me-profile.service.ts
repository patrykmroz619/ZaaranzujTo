import { Injectable } from "@nestjs/common";
import { meResponseSchema } from "@repo/contracts/me";

import { GetBalanceService } from "../../credits/services/get-balance.service";
import { GetUserService } from "../../users/services/get-user.service";

type TGetMeProfileParams = {
  clerkId: string;
  email: string;
};

@Injectable()
export class MeProfileService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly getBalanceService: GetBalanceService,
  ) {}

  getMeProfile = async (params: TGetMeProfileParams) => {
    const { clerkId, email } = params;

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    const balance = await this.getBalanceService.getBalance({
      clerkId,
      email,
    });

    return meResponseSchema.parse({
      user: {
        id: user._id.toString(),
        clerkUserId: user.clerkId,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      creditBalance: balance.balance,
      theme: user.theme ?? "system",
    });
  };
}

import { Injectable } from "@nestjs/common";
import { meResponseSchema, type TUpdateMeRequest } from "@repo/contracts/me";

import { GetBalanceService } from "../../credits/services/get-balance.service";
import { GetUserService } from "../../users/services/get-user.service";
import { UpdateUserThemeService } from "../../users/services/update-user-theme.service";
import { UpdateMeDto } from "../profile.dto";

type TUpdateMeProfileParams = {
  clerkId: string;
  email: string;
  body: UpdateMeDto;
};

@Injectable()
export class UpdateMeProfileService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly updateUserThemeService: UpdateUserThemeService,
    private readonly getBalanceService: GetBalanceService,
  ) {}

  updateMeProfile = async (params: TUpdateMeProfileParams) => {
    const { clerkId, email, body } = params;

    const patch = body;

    await this.getUserService.getUser({ clerkId, email });

    const updatedUser = await this.updateUserThemeService.updateUserTheme({
      clerkId,
      theme: patch.theme,
    });

    const balance = await this.getBalanceService.getBalance({
      clerkId,
      email,
    });

    return meResponseSchema.parse({
      user: {
        id: updatedUser._id.toString(),
        clerkUserId: updatedUser.clerkId,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      },
      creditBalance: balance.balance,
      theme: updatedUser.theme,
    });
  };
}

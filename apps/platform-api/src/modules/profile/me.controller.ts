import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import type { TMeResponse } from "@repo/contracts/me";

import { AuthGuard, CurrentUser, type TAuthData } from "../../shared/auth";
import { MeProfileService } from "./services/me-profile.service";
import { UpdateMeProfileService } from "./services/update-me-profile.service";
import { UpdateProfileDto } from "./profile.dto";

@Controller("me")
export class MeController {
  constructor(
    private readonly meProfileService: MeProfileService,
    private readonly updateMeProfileService: UpdateMeProfileService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getMeProfile(@CurrentUser() currentUser: TAuthData): Promise<TMeResponse> {
    return await this.meProfileService.getMeProfile({
      clerkId: currentUser.userId,
      email: currentUser.email,
    });
  }

  @Patch("profile")
  @UseGuards(AuthGuard)
  async updateMeProfile(
    @CurrentUser() currentUser: TAuthData,
    @Body() body: UpdateProfileDto,
  ): Promise<TMeResponse> {
    return await this.updateMeProfileService.updateMeProfile({
      clerkId: currentUser.userId,
      email: currentUser.email,
      body,
    });
  }
}

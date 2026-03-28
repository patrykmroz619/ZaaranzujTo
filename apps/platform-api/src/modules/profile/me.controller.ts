import { Body, Controller, Delete, Get, Patch, UseGuards } from "@nestjs/common";

import { AuthGuard, CurrentUser, type TAuthData } from "../../shared/auth";
import { DeleteMeAccountPlaceholderService } from "./services/delete-me-account-placeholder.service";
import { MeProfileService } from "./services/me-profile.service";
import { UpdateMeProfileService } from "./services/update-me-profile.service";
import { DeleteMeDto, UpdateMeDto } from "./profile.dto";

@Controller("me")
export class MeController {
  constructor(
    private readonly meProfileService: MeProfileService,
    private readonly updateMeProfileService: UpdateMeProfileService,
    private readonly deleteMeAccountPlaceholderService: DeleteMeAccountPlaceholderService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getMeProfile(@CurrentUser() currentUser: TAuthData) {
    return await this.meProfileService.getMeProfile({
      clerkId: currentUser.userId,
      email: currentUser.email,
    });
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateMeProfile(@CurrentUser() currentUser: TAuthData, @Body() body: UpdateMeDto) {
    return await this.updateMeProfileService.updateMeProfile({
      clerkId: currentUser.userId,
      email: currentUser.email,
      body,
    });
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteMeAccount(@CurrentUser() currentUser: TAuthData, @Body() _body: DeleteMeDto) {
    await this.deleteMeAccountPlaceholderService.deleteMeAccount({
      clerkId: currentUser.userId,
    });
  }
}

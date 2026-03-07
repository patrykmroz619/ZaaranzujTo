import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import type { TMeResponse } from '@repo/contracts/me';

import { AuthGuard, type TAuthenticatedRequest } from '../../shared/libs/auth';
import { MeProfileService } from './services/me-profile.service';
import { UpdateMeProfileService } from './services/update-me-profile.service';
import { UpdateProfileDto } from './profile.dto';

@Controller('me')
export class MeController {
  constructor(
    private readonly meProfileService: MeProfileService,
    private readonly updateMeProfileService: UpdateMeProfileService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getMeProfile(
    @Req() request: TAuthenticatedRequest,
  ): Promise<TMeResponse> {
    return await this.meProfileService.getMeProfile({
      clerkId: request.auth.userId,
      email: request.auth.email,
    });
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  async updateMeProfile(
    @Req() request: TAuthenticatedRequest,
    @Body() body: UpdateProfileDto,
  ): Promise<TMeResponse> {
    return await this.updateMeProfileService.updateMeProfile({
      clerkId: request.auth.userId,
      email: request.auth.email,
      body,
    });
  }
}

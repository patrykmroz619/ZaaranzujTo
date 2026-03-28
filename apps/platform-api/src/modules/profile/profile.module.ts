import { Module } from "@nestjs/common";

import { CreditsModule } from "../credits/credits.module";
import { UsersModule } from "../users/users.module";
import { MeController } from "./me.controller";
import { DeleteMeAccountPlaceholderService } from "./services/delete-me-account-placeholder.service";
import { MeProfileService } from "./services/me-profile.service";
import { UpdateMeProfileService } from "./services/update-me-profile.service";

@Module({
  imports: [UsersModule, CreditsModule],
  controllers: [MeController],
  providers: [MeProfileService, UpdateMeProfileService, DeleteMeAccountPlaceholderService],
})
export class ProfileModule {}

import { Module } from "@nestjs/common";

import { UsersModule } from "../users/users.module";
import { MeController } from "./me.controller";
import { MeProfileService } from "./services/me-profile.service";
import { UpdateMeProfileService } from "./services/update-me-profile.service";

@Module({
  imports: [UsersModule],
  controllers: [MeController],
  providers: [MeProfileService, UpdateMeProfileService],
})
export class ProfileModule {}

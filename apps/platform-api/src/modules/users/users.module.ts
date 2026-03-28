import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { GetUserService } from "./services/get-user.service";
import { UpdateUserProfileService } from "./services/update-user-profile.service";
import { UpdateUserThemeService } from "./services/update-user-theme.service";
import { User, UserSchema } from "./user.schema";
import { UsersRepository } from "./users.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UsersRepository, GetUserService, UpdateUserProfileService, UpdateUserThemeService],
  exports: [GetUserService, UpdateUserProfileService, UpdateUserThemeService],
})
export class UsersModule {}

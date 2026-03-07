import { Module } from "@nestjs/common";
import { ConfigurationModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [ConfigurationModule, DatabaseModule, UsersModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

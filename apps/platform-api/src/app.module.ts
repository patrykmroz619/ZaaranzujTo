import { Module } from "@nestjs/common";
import { ConfigurationModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./modules/health/health.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    UsersModule,
    ProfileModule,
    ProjectsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

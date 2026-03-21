import { Module } from "@nestjs/common";
import { ConfigurationModule } from "./config/config.module";
import { CreditsModule } from "./modules/credits/credits.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./modules/health/health.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { StorageModule } from "./modules/storage/storage.module";
import { UsersModule } from "./modules/users/users.module";
import { VisualizationsModule } from "./modules/visualizations/visualizations.module";

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    UsersModule,
    ProfileModule,
    ProjectsModule,
    VisualizationsModule,
    StorageModule,
    CreditsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { IdentityAccessModule } from './modules/identity-access/identity-access.module';
import { ProfileModule } from './modules/profile/profile.module';
import { UsersModule } from './modules/users/users.module';
import { CurriculumModule } from './modules/curriculum/curriculum.module';
import { LearningProgressModule } from './modules/learning-progress/learning-progress.module';
import { TaskVerificationModule } from './modules/task-verification/task-verification.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    IdentityAccessModule,
    UsersModule,
    ProfileModule,
    CurriculumModule,
    LearningProgressModule,
    TaskVerificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

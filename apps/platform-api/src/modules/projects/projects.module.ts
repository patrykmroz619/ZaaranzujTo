import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UsersModule } from "../users/users.module";
import { Visualization, VisualizationSchema } from "../visualizations/schemas/visualization.schema";
import { ProjectsController } from "./controllers/projects.controller";
import { ProjectsRepository } from "./repositories/projects.repository";
import { Project, ProjectSchema } from "./schemas/project.schema";
import { CreateProjectService } from "./services/create-project.service";
import { DeleteProjectService } from "./services/delete-project.service";
import { GetProjectService } from "./services/get-project.service";
import { ListProjectsService } from "./services/list-projects.service";
import { UpdateProjectService } from "./services/update-project.service";
import { ValidateProjectOwnershipService } from "./services/validate-project-ownership.service";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Project.name,
        schema: ProjectSchema,
      },
      {
        name: Visualization.name,
        schema: VisualizationSchema,
      },
    ]),
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsRepository,
    ListProjectsService,
    CreateProjectService,
    GetProjectService,
    UpdateProjectService,
    DeleteProjectService,
    ValidateProjectOwnershipService,
  ],
  exports: [ValidateProjectOwnershipService],
})
export class ProjectsModule {}

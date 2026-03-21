import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ProjectsModule } from "../projects/projects.module";
import { UsersModule } from "../users/users.module";
import { ListVisualizationIterationsService } from "./iterations/services/list-visualization-iterations.service";
import { VisualizationsRepository } from "./repositories/visualizations.repository";
import { Visualization, VisualizationSchema } from "./schemas/visualization.schema";
import { CreateVisualizationService } from "./services/create-visualization.service";
import { GetVisualizationDetailsService } from "./services/get-visualization-details.service";
import { ListProjectVisualizationsService } from "./services/list-project-visualizations.service";
import { MapVisualizationDetailsService } from "./services/map-visualization-details.service";
import { MapVisualizationSummaryService } from "./services/map-visualization-summary.service";
import { ValidateVisualizationOwnershipService } from "./services/validate-visualization-ownership.service";
import { VisualizationsController } from "./visualizations.controller";

@Module({
  imports: [
    UsersModule,
    ProjectsModule,
    MongooseModule.forFeature([
      {
        name: Visualization.name,
        schema: VisualizationSchema,
      },
    ]),
  ],
  controllers: [VisualizationsController],
  providers: [
    VisualizationsRepository,
    ValidateVisualizationOwnershipService,
    MapVisualizationSummaryService,
    MapVisualizationDetailsService,
    ListProjectVisualizationsService,
    CreateVisualizationService,
    GetVisualizationDetailsService,
    ListVisualizationIterationsService,
  ],
})
export class VisualizationsModule {}

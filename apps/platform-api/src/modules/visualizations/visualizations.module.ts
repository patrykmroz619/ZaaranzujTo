import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AiModule } from "../ai/ai.module";
import { CreditsModule } from "../credits/credits.module";
import { ProjectsModule } from "../projects/projects.module";
import { StorageModule } from "../storage/storage.module";
import { UsersModule } from "../users/users.module";
import { CreateIterationResponseMapper } from "./iterations/mappers/create-iteration-response.mapper";
import { ListVisualizationIterationsService } from "./iterations/services/list-visualization-iterations.service";
import { CreateIterationService } from "./iterations/services/create-iteration.service";
import { IterationPromptBuilderService } from "./iterations/services/iteration-prompt-builder.service";
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
    AiModule,
    StorageModule,
    CreditsModule,
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
    CreateIterationResponseMapper,
    IterationPromptBuilderService,
    CreateIterationService,
  ],
})
export class VisualizationsModule {}

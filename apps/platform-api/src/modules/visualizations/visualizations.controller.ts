import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";

import { AuthGuard, CurrentUser, type TAuthData } from "@/shared/auth";

import {
  createVisualizationRequestSchema,
  listProjectVisualizationsQuerySchema,
  listVisualizationIterationsQuerySchema,
  visualizationIdParamsSchema,
  visualizationProjectIdParamsSchema,
} from "./visualizations.dto";
import { ListProjectVisualizationsService } from "./services/list-project-visualizations.service";
import { CreateVisualizationService } from "./services/create-visualization.service";
import { GetVisualizationDetailsService } from "./services/get-visualization-details.service";
import { ListVisualizationIterationsService } from "./iterations/services/list-visualization-iterations.service";

@Controller()
@UseGuards(AuthGuard)
export class VisualizationsController {
  constructor(
    private readonly listProjectVisualizationsService: ListProjectVisualizationsService,
    private readonly createVisualizationService: CreateVisualizationService,
    private readonly getVisualizationDetailsService: GetVisualizationDetailsService,
    private readonly listVisualizationIterationsService: ListVisualizationIterationsService,
  ) {}

  @Get("projects/:projectId/visualizations")
  listProjectVisualizations(
    @CurrentUser() currentUser: TAuthData,
    @Param() params: unknown,
    @Query() query: unknown,
  ) {
    const parsedParams = visualizationProjectIdParamsSchema.parse(params);
    const parsedQuery = listProjectVisualizationsQuerySchema.parse(query);

    return this.listProjectVisualizationsService.listProjectVisualizations({
      clerkId: currentUser.userId,
      email: currentUser.email,
      projectId: parsedParams.projectId,
      query: parsedQuery,
    });
  }

  @Post("projects/:projectId/visualizations")
  createVisualization(
    @CurrentUser() currentUser: TAuthData,
    @Param() params: unknown,
    @Body() body: unknown,
  ) {
    const parsedParams = visualizationProjectIdParamsSchema.parse(params);
    const parsedBody = createVisualizationRequestSchema.parse(body);

    return this.createVisualizationService.createVisualization({
      clerkId: currentUser.userId,
      email: currentUser.email,
      projectId: parsedParams.projectId,
      body: parsedBody,
    });
  }

  @Get("visualizations/:visualizationId")
  getVisualizationDetails(@CurrentUser() currentUser: TAuthData, @Param() params: unknown) {
    const parsedParams = visualizationIdParamsSchema.parse(params);

    return this.getVisualizationDetailsService.getVisualizationDetails({
      clerkId: currentUser.userId,
      email: currentUser.email,
      visualizationId: parsedParams.visualizationId,
    });
  }

  @Get("visualizations/:visualizationId/iterations")
  listVisualizationIterations(
    @CurrentUser() currentUser: TAuthData,
    @Param() params: unknown,
    @Query() query: unknown,
  ) {
    const parsedParams = visualizationIdParamsSchema.parse(params);
    const parsedQuery = listVisualizationIterationsQuerySchema.parse(query);

    return this.listVisualizationIterationsService.listVisualizationIterations({
      clerkId: currentUser.userId,
      email: currentUser.email,
      visualizationId: parsedParams.visualizationId,
      query: parsedQuery,
    });
  }
}

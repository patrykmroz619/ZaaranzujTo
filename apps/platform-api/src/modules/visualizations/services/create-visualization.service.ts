import { Injectable, Logger } from "@nestjs/common";

import { IterationAccessService } from "../iterations/services/internal/iteration-access.service";
import { CreateIterationService } from "../iterations/services/create-iteration.service";
import type { TUploadedFile } from "../iterations/services/internal/iteration.types";
import { VisualizationsRepository } from "../repositories/visualizations.repository";
import { type TCreateVisualizationRequest } from "../visualizations.dto";
import { MapVisualizationDetailsService } from "./map-visualization-details.service";

type TCreateVisualizationParams = {
  clerkId: string;
  email: string;
  projectId: string;
  body: TCreateVisualizationRequest;
  inputPhoto: TUploadedFile | undefined;
  inspirationPhoto: TUploadedFile | undefined;
  referencePhotos: TUploadedFile[];
};

@Injectable()
export class CreateVisualizationService {
  private readonly logger = new Logger(CreateVisualizationService.name);

  constructor(
    private readonly iterationAccessService: IterationAccessService,
    private readonly visualizationsRepository: VisualizationsRepository,
    private readonly createIterationService: CreateIterationService,
    private readonly mapVisualizationDetailsService: MapVisualizationDetailsService,
  ) {}

  createVisualization = async (params: TCreateVisualizationParams) => {
    const { clerkId, email, projectId, body, inputPhoto, inspirationPhoto, referencePhotos } = params;

    const user = await this.iterationAccessService.resolveAuthorizedUserForProject({
      clerkId,
      email,
      projectId,
    });

    const createdVisualization = await this.visualizationsRepository.createVisualizationForUser({
      userId: user._id,
      projectId,
      name: body.name,
      stylePreset: body.stylePreset,
      stylePresetCustom: body.stylePresetCustom,
      palette: body.palette,
      paletteCustom: body.paletteCustom,
      roomType: body.roomType,
      roomTypeCustom: body.roomTypeCustom,
    });

    try {
      const { visualization } = await this.createIterationService.createIteration({
        visualization: createdVisualization,
        userId: user._id,
        prompt: body.prompt ?? "",
        inputPhoto,
        inspirationPhoto,
        parentIterationId: undefined,
        referencePhotos,
      });

      return this.mapVisualizationDetailsService.map({
        visualizationDocument: visualization,
      });
    } catch (error) {
      this.logger.error(
        `[createVisualization] Initial iteration failed, rolling back visualization: ${error instanceof Error ? error.message : String(error)}`,
      );

      await this.visualizationsRepository
        .deleteVisualizationByIdForUser({
          userId: user._id,
          visualizationId: createdVisualization._id.toString(),
        })
        .catch(() => undefined);

      throw error;
    }
  };
}

import { Injectable } from "@nestjs/common";

import { GetUserService } from "../../users/services/get-user.service";
import { VisualizationsRepository } from "../repositories/visualizations.repository";
import { type TCreateVisualizationRequest } from "../visualizations.dto";
import { MapVisualizationDetailsService } from "./map-visualization-details.service";
import { ValidateProjectOwnershipService } from "./validate-project-ownership.service";

type TCreateVisualizationParams = {
  clerkId: string;
  email: string;
  projectId: string;
  body: TCreateVisualizationRequest;
};

@Injectable()
export class CreateVisualizationService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly validateProjectOwnershipService: ValidateProjectOwnershipService,
    private readonly visualizationsRepository: VisualizationsRepository,
    private readonly mapVisualizationDetailsService: MapVisualizationDetailsService,
  ) {}

  createVisualization = async (params: TCreateVisualizationParams) => {
    const { clerkId, email, projectId, body } = params;

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    await this.validateProjectOwnershipService.validate({
      userId: user._id,
      projectId,
    });

    const createdVisualization = await this.visualizationsRepository.createVisualizationForUser({
      userId: user._id,
      projectId,
      name: body.name,
      mode: body.mode,
    });

    return this.mapVisualizationDetailsService.map({
      visualizationDocument: createdVisualization,
    });
  };
}

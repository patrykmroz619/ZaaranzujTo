import { BadRequestException, Injectable } from "@nestjs/common";

import { GetUserService } from "../../users/services/get-user.service";
import { MapVisualizationDetailsService } from "./map-visualization-details.service";
import { ValidateVisualizationOwnershipService } from "./validate-visualization-ownership.service";

type TUpdateVisualizationParams = {
  clerkId: string;
  email: string;
  visualizationId: string;
  body: {
    name?: string;
  };
};

@Injectable()
export class UpdateVisualizationService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly validateVisualizationOwnershipService: ValidateVisualizationOwnershipService,
    private readonly mapVisualizationDetailsService: MapVisualizationDetailsService,
  ) {}

  updateVisualization = async (params: TUpdateVisualizationParams) => {
    const { clerkId, email, visualizationId, body } = params;

    if (body.name === undefined) {
      throw new BadRequestException("At least one field must be provided.");
    }

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    const visualization = await this.validateVisualizationOwnershipService.validate({
      userId: user._id,
      visualizationId,
    });

    visualization.name = body.name;
    await visualization.save();

    return this.mapVisualizationDetailsService.map({
      visualizationDocument: visualization,
    });
  };
}

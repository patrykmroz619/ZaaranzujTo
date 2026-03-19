import { Injectable } from "@nestjs/common";

import { GetUserService } from "../../users/services/get-user.service";
import { MapVisualizationDetailsService } from "./map-visualization-details.service";
import { ValidateVisualizationOwnershipService } from "./validate-visualization-ownership.service";

type TGetVisualizationDetailsParams = {
  clerkId: string;
  email: string;
  visualizationId: string;
};

@Injectable()
export class GetVisualizationDetailsService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly validateVisualizationOwnershipService: ValidateVisualizationOwnershipService,
    private readonly mapVisualizationDetailsService: MapVisualizationDetailsService,
  ) {}

  getVisualizationDetails = async (params: TGetVisualizationDetailsParams) => {
    const { clerkId, email, visualizationId } = params;

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    const visualization = await this.validateVisualizationOwnershipService.validate({
      userId: user._id,
      visualizationId,
    });

    return this.mapVisualizationDetailsService.map({
      visualizationDocument: visualization,
    });
  };
}

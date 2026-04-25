import { Injectable } from "@nestjs/common";
import { deleteVisualizationResponseSchema } from "@repo/contracts/projects";

import { GetUserService } from "../../users/services/get-user.service";
import { VisualizationsRepository } from "../repositories/visualizations.repository";
import { ValidateVisualizationOwnershipService } from "./validate-visualization-ownership.service";

type TDeleteVisualizationParams = {
  clerkId: string;
  email: string;
  visualizationId: string;
};

@Injectable()
export class DeleteVisualizationService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly visualizationsRepository: VisualizationsRepository,
    private readonly validateVisualizationOwnershipService: ValidateVisualizationOwnershipService,
  ) {}

  deleteVisualization = async (params: TDeleteVisualizationParams) => {
    const { clerkId, email, visualizationId } = params;

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    await this.validateVisualizationOwnershipService.validate({
      userId: user._id,
      visualizationId,
    });

    await this.visualizationsRepository.deleteVisualizationByIdForUser({
      userId: user._id,
      visualizationId,
    });

    return deleteVisualizationResponseSchema.parse({
      deleted: true,
      visualizationId,
    });
  };
}

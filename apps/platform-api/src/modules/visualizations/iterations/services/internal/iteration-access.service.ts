import { Injectable } from "@nestjs/common";

import { GetUserService } from "@/modules/users/services/get-user.service";
import { ValidateProjectOwnershipService } from "@/modules/projects/services/validate-project-ownership.service";

import { ValidateVisualizationOwnershipService } from "../../../services/validate-visualization-ownership.service";

type TResolveAuthorizedUserParams = {
  clerkId: string;
  email: string;
  visualizationId: string;
};

type TResolveAuthorizedUserAndVisualizationParams = TResolveAuthorizedUserParams;

type TResolveAuthorizedUserForProjectParams = {
  clerkId: string;
  email: string;
  projectId: string;
};

@Injectable()
export class IterationAccessService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly validateVisualizationOwnershipService: ValidateVisualizationOwnershipService,
    private readonly validateProjectOwnershipService: ValidateProjectOwnershipService,
  ) {}

  resolveAuthorizedUser = async (params: TResolveAuthorizedUserParams) => {
    const { clerkId, email, visualizationId } = params;

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    await this.validateVisualizationOwnershipService.validate({
      userId: user._id,
      visualizationId,
    });

    return user;
  };

  resolveAuthorizedUserAndVisualization = async (
    params: TResolveAuthorizedUserAndVisualizationParams,
  ) => {
    const { clerkId, email, visualizationId } = params;

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    const visualization = await this.validateVisualizationOwnershipService.validate({
      userId: user._id,
      visualizationId,
    });

    return { user, visualization };
  };

  resolveAuthorizedUserForProject = async (params: TResolveAuthorizedUserForProjectParams) => {
    const { clerkId, email, projectId } = params;

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    await this.validateProjectOwnershipService.validate({
      userId: user._id,
      projectId,
    });

    return user;
  };
}

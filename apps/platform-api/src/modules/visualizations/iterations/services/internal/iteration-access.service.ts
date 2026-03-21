import { Injectable } from "@nestjs/common";

import { GetUserService } from "@/modules/users/services/get-user.service";

import { ValidateVisualizationOwnershipService } from "../../../services/validate-visualization-ownership.service";

type TResolveAuthorizedUserParams = {
  clerkId: string;
  email: string;
  visualizationId: string;
};

@Injectable()
export class IterationAccessService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly validateVisualizationOwnershipService: ValidateVisualizationOwnershipService,
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
}

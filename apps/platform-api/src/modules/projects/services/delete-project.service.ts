import { Injectable, NotFoundException } from "@nestjs/common";
import { deleteProjectResponseSchema } from "@repo/contracts/projects";

import { GetUserService } from "../../users/services/get-user.service";
import { ProjectsRepository } from "../repositories/projects.repository";

type TDeleteProjectParams = {
  clerkId: string;
  email: string;
  projectId: string;
};

@Injectable()
export class DeleteProjectService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  deleteProject = async (params: TDeleteProjectParams) => {
    const { clerkId, email, projectId } = params;

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    const deletedProject = await this.projectsRepository.deleteProjectByIdForUser({
      userId: user._id,
      projectId,
    });

    if (!deletedProject) {
      throw new NotFoundException("Project not found.");
    }

    return deleteProjectResponseSchema.parse({
      deleted: true,
      projectId,
    });
  };
}

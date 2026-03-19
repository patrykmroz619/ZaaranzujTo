import { Injectable, NotFoundException } from "@nestjs/common";
import { getProjectResponseSchema } from "@repo/contracts/projects";

import { GetUserService } from "../../users/services/get-user.service";
import { ProjectsRepository } from "../repositories/projects.repository";
import { mapProjectDocumentToProjectObject } from "./project-mapper";

type TGetProjectParams = {
  clerkId: string;
  email: string;
  projectId: string;
};

@Injectable()
export class GetProjectService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  getProject = async (params: TGetProjectParams) => {
    const { clerkId, email, projectId } = params;

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    const project = await this.projectsRepository.findProjectByIdForUser({
      userId: user._id,
      projectId,
    });

    if (!project) {
      throw new NotFoundException("Project not found.");
    }

    return getProjectResponseSchema.parse(
      mapProjectDocumentToProjectObject({
        projectDocument: project,
      }),
    );
  };
}

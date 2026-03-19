import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { updateProjectResponseSchema } from "@repo/contracts/projects";

import { GetUserService } from "../../users/services/get-user.service";
import { UpdateProjectDto } from "../projects.dto";
import { ProjectsRepository } from "../repositories/projects.repository";
import { mapProjectDocumentToProjectObject } from "./project-mapper";

type TUpdateProjectParams = {
  clerkId: string;
  email: string;
  projectId: string;
  body: UpdateProjectDto;
};

@Injectable()
export class UpdateProjectService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  updateProject = async (params: TUpdateProjectParams) => {
    const { clerkId, email, projectId, body } = params;

    if (body.name === undefined) {
      throw new BadRequestException("At least one field must be provided.");
    }

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    const updatedProject = await this.projectsRepository.updateProjectByIdForUser({
      userId: user._id,
      projectId,
      name: body.name,
    });

    if (!updatedProject) {
      throw new NotFoundException("Project not found.");
    }

    return updateProjectResponseSchema.parse(
      mapProjectDocumentToProjectObject({
        projectDocument: updatedProject,
      }),
    );
  };
}

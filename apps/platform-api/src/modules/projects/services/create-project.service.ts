import { Injectable } from "@nestjs/common";
import { createProjectRequestSchema, createProjectResponseSchema } from "@repo/contracts/projects";

import { GetUserService } from "../../users/services/get-user.service";

import { CreateProjectDto } from "../projects.dto";
import { ProjectsRepository } from "../repositories/projects.repository";
import { mapProjectDocumentToProjectObject } from "./project-mapper";

type TCreateProjectParams = {
  clerkId: string;
  email: string;
  body: CreateProjectDto;
};

@Injectable()
export class CreateProjectService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  createProject = async (params: TCreateProjectParams) => {
    const { clerkId, email, body } = params;

    const parsedBody = createProjectRequestSchema.parse(body);

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    const createdProject = await this.projectsRepository.createProjectForUser({
      userId: user._id,
      name: parsedBody.name,
    });

    return createProjectResponseSchema.parse(
      mapProjectDocumentToProjectObject({
        projectDocument: createdProject,
      }),
    );
  };
}

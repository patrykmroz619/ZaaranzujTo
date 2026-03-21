import { Injectable, NotFoundException } from "@nestjs/common";
import type { Types } from "mongoose";

import { ProjectsRepository } from "../repositories/projects.repository";

type TValidateProjectOwnershipParams = {
  userId: Types.ObjectId;
  projectId: string;
};

@Injectable()
export class ValidateProjectOwnershipService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  validate = async (params: TValidateProjectOwnershipParams): Promise<void> => {
    const { userId, projectId } = params;

    const project = await this.projectsRepository.findProjectByIdForUser({
      userId,
      projectId,
    });

    if (!project) {
      throw new NotFoundException("Project not found.");
    }
  };
}

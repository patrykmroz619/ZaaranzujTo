import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model, Types } from "mongoose";

import { Project } from "../../projects/schemas/project.schema";
import { VISUALIZATION_ERRORS } from "../visualizations.constants";

type TValidateProjectOwnershipParams = {
  userId: Types.ObjectId;
  projectId: string;
};

@Injectable()
export class ValidateProjectOwnershipService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
  ) {}

  validate = async (params: TValidateProjectOwnershipParams): Promise<void> => {
    const { userId, projectId } = params;

    const project = await this.projectModel.findOne({
      _id: projectId,
      userId,
    });

    if (!project) {
      throw new NotFoundException(VISUALIZATION_ERRORS.projectNotFound);
    }
  };
}

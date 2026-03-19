import { Injectable, NotFoundException } from "@nestjs/common";
import type { Types } from "mongoose";

import { VISUALIZATION_ERRORS } from "../visualizations.constants";
import { VisualizationsRepository } from "../repositories/visualizations.repository";

type TValidateVisualizationOwnershipParams = {
  userId: Types.ObjectId;
  visualizationId: string;
};

@Injectable()
export class ValidateVisualizationOwnershipService {
  constructor(private readonly visualizationsRepository: VisualizationsRepository) {}

  validate = async (params: TValidateVisualizationOwnershipParams) => {
    const { userId, visualizationId } = params;

    const visualization = await this.visualizationsRepository.findVisualizationByIdForUser({
      userId,
      visualizationId,
    });

    if (!visualization) {
      throw new NotFoundException(VISUALIZATION_ERRORS.visualizationNotFound);
    }

    return visualization;
  };
}

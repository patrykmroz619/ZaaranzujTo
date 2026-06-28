import { Injectable } from "@nestjs/common";

import { GetUserService } from "../../../users/services/get-user.service";
import { VisualizationsRepository } from "../../repositories/visualizations.repository";
import {
  listVisualizationIterationsQuerySchema,
  type TListVisualizationIterationsQuery,
} from "../../visualizations.dto";
import { ValidateVisualizationOwnershipService } from "../../services/validate-visualization-ownership.service";

type TListVisualizationIterationsParams = {
  clerkId: string;
  email: string;
  visualizationId: string;
  query: TListVisualizationIterationsQuery;
};

@Injectable()
export class ListVisualizationIterationsService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly validateVisualizationOwnershipService: ValidateVisualizationOwnershipService,
    private readonly visualizationsRepository: VisualizationsRepository,
  ) {}

  listVisualizationIterations = async (params: TListVisualizationIterationsParams) => {
    const { clerkId, email, visualizationId, query } = params;

    const parsedQuery = listVisualizationIterationsQuerySchema.parse(query);

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    await this.validateVisualizationOwnershipService.validate({
      userId: user._id,
      visualizationId,
    });

    const result = await this.visualizationsRepository.listIterationsForVisualizationForUser({
      userId: user._id,
      visualizationId,
      page: parsedQuery.page,
      pageSize: parsedQuery.pageSize,
      sort: parsedQuery.sort,
    });

    const totalPages =
      result.totalItems === 0 ? 0 : Math.ceil(result.totalItems / parsedQuery.pageSize);

    return {
      items: result.items.map((iteration) => ({
        id: iteration._id.toString(),
        iterationNo: iteration.iterationNo,
        baseIterationId: iteration.baseIterationId,
        status: iteration.status,
        failureCode: iteration.failureCode,
        generationInput: {
          mode: iteration.generationInput.mode,
          prompt: iteration.generationInput.prompt,
          inputAsset: iteration.generationInput.inputAsset,
          referenceAssets: iteration.generationInput.referenceAssets,
          inspirationAsset: iteration.generationInput.inspirationAsset ?? null,
        },
        outputAsset: iteration.outputAsset,
        result: {
          imageAssetId: iteration.result.imageAssetId,
        },
        createdAt: iteration.createdAt.toISOString(),
      })),
      pagination: {
        page: parsedQuery.page,
        pageSize: parsedQuery.pageSize,
        totalItems: result.totalItems,
        totalPages,
      },
    };
  };
}

import { Injectable } from "@nestjs/common";
import type { TListProjectVisualizationsSort } from "../schemas/visualization.schema";

import { GetUserService } from "../../users/services/get-user.service";
import { type TListProjectVisualizationsQuery } from "../visualizations.dto";
import { VisualizationsRepository } from "../repositories/visualizations.repository";
import { MapVisualizationSummaryService } from "./map-visualization-summary.service";
import { ValidateProjectOwnershipService } from "./validate-project-ownership.service";

type TListProjectVisualizationsParams = {
  clerkId: string;
  email: string;
  projectId: string;
  query: TListProjectVisualizationsQuery;
};

@Injectable()
export class ListProjectVisualizationsService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly validateProjectOwnershipService: ValidateProjectOwnershipService,
    private readonly visualizationsRepository: VisualizationsRepository,
    private readonly mapVisualizationSummaryService: MapVisualizationSummaryService,
  ) {}

  listProjectVisualizations = async (params: TListProjectVisualizationsParams) => {
    const { clerkId, email, projectId, query } = params;

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    await this.validateProjectOwnershipService.validate({
      userId: user._id,
      projectId,
    });

    const listParams = {
      userId: user._id,
      projectId,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort as TListProjectVisualizationsSort,
    };

    const [items, totalItems] = await Promise.all([
      this.visualizationsRepository.listVisualizationsForProjectForUser(listParams),
      this.visualizationsRepository.countVisualizationsForProjectForUser({
        userId: user._id,
        projectId,
      }),
    ]);

    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / query.pageSize);

    return {
      items: items.map((visualizationDocument) =>
        this.mapVisualizationSummaryService.map({
          visualizationDocument,
        }),
      ),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        totalItems,
        totalPages,
      },
    };
  };
}

import { Injectable } from "@nestjs/common";
import { listProjectsQuerySchema, listProjectsResponseSchema } from "@repo/contracts/projects";

import { GetUserService } from "../../users/services/get-user.service";
import { ProjectsRepository } from "../repositories/projects.repository";
import { ListProjectsQueryDto } from "../projects.dto";
import { mapProjectDocumentToProjectObject } from "./project-mapper";

type TListProjectsParams = {
  clerkId: string;
  email: string;
  query: ListProjectsQueryDto;
};

@Injectable()
export class ListProjectsService {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  listProjects = async (params: TListProjectsParams) => {
    const { clerkId, email, query } = params;

    const parsedQuery = listProjectsQuerySchema.parse(query);

    const user = await this.getUserService.getUser({
      clerkId,
      email,
    });

    const listParams = {
      userId: user._id,
      page: parsedQuery.page,
      pageSize: parsedQuery.pageSize,
      sort: parsedQuery.sort,
    };

    const [projects, totalItems] = await Promise.all([
      this.projectsRepository.listProjectsForUser(listParams),
      this.projectsRepository.countProjectsForUser({
        userId: user._id,
      }),
    ]);

    const visualizationCounts = await this.projectsRepository.countVisualizationsForProjects({
      userId: user._id,
      projectIds: projects.map((projectDocument) => projectDocument._id),
    });

    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / parsedQuery.pageSize);

    return listProjectsResponseSchema.parse({
      items: projects.map((projectDocument) =>
        mapProjectDocumentToProjectObject({
          projectDocument,
          visualizationCount: visualizationCounts.get(projectDocument._id.toString()) ?? 0,
        }),
      ),
      pagination: {
        page: parsedQuery.page,
        pageSize: parsedQuery.pageSize,
        totalItems,
        totalPages,
      },
    });
  };
}

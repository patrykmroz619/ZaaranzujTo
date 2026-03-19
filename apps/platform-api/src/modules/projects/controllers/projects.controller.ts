import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";

import { AuthGuard, CurrentUser, type TAuthData } from "@/shared/auth";
import {
  CreateProjectDto,
  ListProjectsQueryDto,
  ProjectIdParamsDto,
  UpdateProjectDto,
} from "../projects.dto";
import { CreateProjectService } from "../services/create-project.service";
import { DeleteProjectService } from "../services/delete-project.service";
import { GetProjectService } from "../services/get-project.service";
import { ListProjectsService } from "../services/list-projects.service";
import { UpdateProjectService } from "../services/update-project.service";

@Controller("projects")
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(
    private readonly listProjectsService: ListProjectsService,
    private readonly createProjectService: CreateProjectService,
    private readonly getProjectService: GetProjectService,
    private readonly updateProjectService: UpdateProjectService,
    private readonly deleteProjectService: DeleteProjectService,
  ) {}

  @Get()
  listProjects(@CurrentUser() currentUser: TAuthData, @Query() query: ListProjectsQueryDto) {
    return this.listProjectsService.listProjects({
      clerkId: currentUser.userId,
      email: currentUser.email,
      query,
    });
  }

  @Post()
  createProject(@CurrentUser() currentUser: TAuthData, @Body() body: CreateProjectDto) {
    return this.createProjectService.createProject({
      clerkId: currentUser.userId,
      email: currentUser.email,
      body,
    });
  }

  @Get(":projectId")
  getProject(@CurrentUser() currentUser: TAuthData, @Param() params: ProjectIdParamsDto) {
    return this.getProjectService.getProject({
      clerkId: currentUser.userId,
      email: currentUser.email,
      projectId: params.projectId,
    });
  }

  @Patch(":projectId")
  updateProject(
    @CurrentUser() currentUser: TAuthData,
    @Param() params: ProjectIdParamsDto,
    @Body() body: UpdateProjectDto,
  ) {
    return this.updateProjectService.updateProject({
      clerkId: currentUser.userId,
      email: currentUser.email,
      projectId: params.projectId,
      body,
    });
  }

  @Delete(":projectId")
  deleteProject(@CurrentUser() currentUser: TAuthData, @Param() params: ProjectIdParamsDto) {
    return this.deleteProjectService.deleteProject({
      clerkId: currentUser.userId,
      email: currentUser.email,
      projectId: params.projectId,
    });
  }
}

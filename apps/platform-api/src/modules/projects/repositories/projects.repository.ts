import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model, SortOrder, Types } from "mongoose";

import { type TProjectSort } from "@repo/contracts/projects";

import { Project, type TProjectDocument } from "../schemas/project.schema";

type TCreateProjectForUserParams = {
  userId: Types.ObjectId | string;
  name: string;
};

type TFindProjectByIdForUserParams = {
  userId: Types.ObjectId | string;
  projectId: string;
};

type TUpdateProjectByIdForUserParams = {
  userId: Types.ObjectId | string;
  projectId: string;
  name: string;
};

type TDeleteProjectByIdForUserParams = {
  userId: Types.ObjectId | string;
  projectId: string;
};

type TListProjectsForUserParams = {
  userId: Types.ObjectId | string;
  page: number;
  pageSize: number;
  sort: TProjectSort;
};

@Injectable()
export class ProjectsRepository {
  private readonly sortMapping: Record<TProjectSort, { [key: string]: SortOrder }> = {
    "createdAt:desc": { createdAt: -1 },
    "createdAt:asc": { createdAt: 1 },
    "updatedAt:desc": { updatedAt: -1 },
    "updatedAt:asc": { updatedAt: 1 },
    "name:desc": { name: -1 },
    "name:asc": { name: 1 },
  };

  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
  ) {}

  createProjectForUser = async (params: TCreateProjectForUserParams): Promise<TProjectDocument> => {
    const { userId, name } = params;

    return await this.projectModel.create({
      userId,
      name,
    });
  };

  findProjectByIdForUser = async (
    params: TFindProjectByIdForUserParams,
  ): Promise<TProjectDocument | null> => {
    const { userId, projectId } = params;

    const filter = {
      _id: projectId,
      userId,
    };

    return await this.projectModel.findOne(filter);
  };

  updateProjectByIdForUser = async (
    params: TUpdateProjectByIdForUserParams,
  ): Promise<TProjectDocument | null> => {
    const { userId, projectId, name } = params;

    const filter = {
      _id: projectId,
      userId,
    };

    return await this.projectModel.findOneAndUpdate(
      filter,
      {
        $set: {
          name,
        },
      },
      {
        returnDocument: "after",
      },
    );
  };

  deleteProjectByIdForUser = async (
    params: TDeleteProjectByIdForUserParams,
  ): Promise<TProjectDocument | null> => {
    const { userId, projectId } = params;

    const filter = {
      _id: projectId,
      userId,
    };

    return await this.projectModel.findOneAndDelete(filter);
  };

  listProjectsForUser = async (params: TListProjectsForUserParams): Promise<TProjectDocument[]> => {
    const { userId, page, pageSize, sort } = params;

    const offset = (page - 1) * pageSize;

    return await this.projectModel
      .find({ userId })
      .sort(this.sortMapping[sort])
      .skip(offset)
      .limit(pageSize);
  };

  countProjectsForUser = async ({
    userId,
  }: {
    userId: Types.ObjectId | string;
  }): Promise<number> => {
    return await this.projectModel.countDocuments({ userId });
  };
}

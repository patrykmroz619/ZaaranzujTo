import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model, Types } from "mongoose";

import {
  Iteration,
  TListProjectVisualizationsSort,
  TListVisualizationIterationsSort,
  TVisualizationDocument,
  Visualization,
  iterationSortMapping,
  visualizationSortMapping,
} from "../schemas/visualization.schema";

type TCreateVisualizationForUserParams = {
  userId: Types.ObjectId;
  projectId: string;
  name: string;
  mode: "fromPhoto" | "fromScratch";
};

type TFindVisualizationByIdForUserParams = {
  userId: Types.ObjectId;
  visualizationId: string;
};

type TListVisualizationsForProjectForUserParams = {
  userId: Types.ObjectId;
  projectId: string;
  page: number;
  pageSize: number;
  sort: TListProjectVisualizationsSort;
};

type TCountVisualizationsForProjectForUserParams = {
  userId: Types.ObjectId;
  projectId: string;
};

type TListIterationsForVisualizationForUserParams = {
  userId: Types.ObjectId;
  visualizationId: string;
  page: number;
  pageSize: number;
  sort: TListVisualizationIterationsSort;
};

@Injectable()
export class VisualizationsRepository {
  constructor(
    @InjectModel(Visualization.name)
    private readonly visualizationModel: Model<Visualization>,
  ) {}

  createVisualizationForUser = async (
    params: TCreateVisualizationForUserParams,
  ): Promise<TVisualizationDocument> => {
    const { userId, projectId, name, mode } = params;

    return await this.visualizationModel.create({
      userId,
      projectId,
      name,
      mode,
      inputRoomPhotoAssetId: null,
      iterations: [],
      iterationsCount: 0,
      latestIteration: null,
    });
  };

  findVisualizationByIdForUser = async (
    params: TFindVisualizationByIdForUserParams,
  ): Promise<TVisualizationDocument | null> => {
    const { userId, visualizationId } = params;

    return await this.visualizationModel.findOne({
      _id: visualizationId,
      userId,
    });
  };

  listVisualizationsForProjectForUser = async (
    params: TListVisualizationsForProjectForUserParams,
  ): Promise<TVisualizationDocument[]> => {
    const { userId, projectId, page, pageSize, sort } = params;

    const offset = (page - 1) * pageSize;

    return await this.visualizationModel
      .find({
        userId,
        projectId,
      })
      .sort(visualizationSortMapping[sort])
      .skip(offset)
      .limit(pageSize);
  };

  countVisualizationsForProjectForUser = async (
    params: TCountVisualizationsForProjectForUserParams,
  ): Promise<number> => {
    const { userId, projectId } = params;

    return await this.visualizationModel.countDocuments({
      userId,
      projectId,
    });
  };

  listIterationsForVisualizationForUser = async (
    params: TListIterationsForVisualizationForUserParams,
  ): Promise<{ items: Iteration[]; totalItems: number }> => {
    const { userId, visualizationId, page, pageSize, sort } = params;

    const visualization = await this.visualizationModel.findOne({
      _id: visualizationId,
      userId,
    });

    if (!visualization) {
      return {
        items: [],
        totalItems: 0,
      };
    }

    const sortOrder = iterationSortMapping[sort];

    const ordered = [...visualization.iterations].sort((left, right) => {
      if (left.iterationNo === right.iterationNo) {
        return 0;
      }

      if (sortOrder === 1) {
        return left.iterationNo - right.iterationNo;
      }

      return right.iterationNo - left.iterationNo;
    });

    const totalItems = ordered.length;
    const offset = (page - 1) * pageSize;

    return {
      items: ordered.slice(offset, offset + pageSize),
      totalItems,
    };
  };
}

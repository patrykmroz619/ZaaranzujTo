import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Types, type Model } from "mongoose";

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
  stylePreset: string;
  palette: string;
  roomType: string;
};

type TDeleteVisualizationByIdForUserParams = {
  userId: Types.ObjectId;
  visualizationId: string;
};

type TFindVisualizationByIdForUserParams = {
  userId: Types.ObjectId;
  visualizationId: string;
};

type TUpdateVisualizationNameByIdForUserParams = {
  userId: Types.ObjectId;
  visualizationId: string;
  name: string;
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

type TAppendIterationForVisualizationForUserParams = {
  userId: Types.ObjectId;
  visualizationId: string;
  status: "succeeded" | "failed";
  baseIterationId: string | null;
  generationInput: {
    mode: string;
    prompt: string | null;
    inputAsset: string | null;
    referenceAssets: string[];
  };
  outputAsset: string | null;
  resultImageAssetId: string | null;
  failureCode: string | null;
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
    const { userId, projectId, name, stylePreset, palette, roomType } = params;

    return await this.visualizationModel.create({
      userId,
      projectId,
      name,
      stylePreset,
      palette,
      roomType,
      iterations: [],
      iterationsCount: 0,
      latestIteration: null,
    });
  };

  deleteVisualizationByIdForUser = async (
    params: TDeleteVisualizationByIdForUserParams,
  ): Promise<void> => {
    const { userId, visualizationId } = params;

    await this.visualizationModel.deleteOne({
      _id: visualizationId,
      userId,
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

  updateVisualizationNameByIdForUser = async (
    params: TUpdateVisualizationNameByIdForUserParams,
  ): Promise<TVisualizationDocument | null> => {
    const { userId, visualizationId, name } = params;

    return await this.visualizationModel.findOneAndUpdate(
      {
        _id: visualizationId,
        userId,
      },
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

  appendIterationForVisualizationForUser = async (
    params: TAppendIterationForVisualizationForUserParams,
  ): Promise<TVisualizationDocument | null> => {
    const {
      userId,
      visualizationId,
      status,
      generationInput,
      outputAsset,
      resultImageAssetId,
      failureCode,
    } = params;

    const visualization = await this.visualizationModel.findOne({
      _id: visualizationId,
      userId,
    });

    if (!visualization) {
      return null;
    }

    const nextIterationNo = visualization.iterationsCount + 1;
    const now = new Date();
    const iterationId = new Types.ObjectId();

    visualization.iterations.push({
      _id: iterationId,
      iterationNo: nextIterationNo,
      baseIterationId: params.baseIterationId ?? null,
      status,
      failureCode,
      generationInput,
      outputAsset,
      result: {
        imageAssetId: resultImageAssetId,
      },
      createdAt: now,
    });

    visualization.iterationsCount = nextIterationNo;

    if (status === "succeeded" && resultImageAssetId) {
      visualization.latestIteration = {
        id: iterationId.toString(),
        iterationNo: nextIterationNo,
        imageAssetId: resultImageAssetId,
        createdAt: now,
      };
    }

    visualization.updatedAt = now;

    await visualization.save();

    return visualization;
  };
}

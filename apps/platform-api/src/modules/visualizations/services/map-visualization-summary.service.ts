import { Injectable } from "@nestjs/common";

import type { TVisualizationDocument } from "../schemas/visualization.schema";

@Injectable()
export class MapVisualizationSummaryService {
  map = (params: { visualizationDocument: TVisualizationDocument }) => {
    const { visualizationDocument } = params;

    return {
      id: visualizationDocument._id.toString(),
      projectId: visualizationDocument.projectId.toString(),
      name: visualizationDocument.name,
      stylePreset: visualizationDocument.stylePreset,
      palette: visualizationDocument.palette,
      roomType: visualizationDocument.roomType,
      iterationsCount: visualizationDocument.iterationsCount,
      latestIteration: visualizationDocument.latestIteration
        ? {
            id: visualizationDocument.latestIteration.id,
            iterationNo: visualizationDocument.latestIteration.iterationNo,
            imageAssetId: visualizationDocument.latestIteration.imageAssetId,
            createdAt: visualizationDocument.latestIteration.createdAt.toISOString(),
          }
        : null,
      createdAt: visualizationDocument.createdAt.toISOString(),
      updatedAt: visualizationDocument.updatedAt.toISOString(),
    };
  };
}

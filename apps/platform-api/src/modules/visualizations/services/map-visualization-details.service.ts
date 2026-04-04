import { Injectable } from "@nestjs/common";

import type { Iteration, TVisualizationDocument } from "../schemas/visualization.schema";

const mapIteration = (params: { iteration: Iteration }) => {
  const { iteration } = params;

  return {
    id: iteration._id.toString(),
    iterationNo: iteration.iterationNo,
    baseIterationId: iteration.baseIterationId,
    status: iteration.status,
    failureCode: iteration.failureCode,
    generationInput: {
      mode: iteration.generationInput.mode,
      stylePreset: iteration.generationInput.stylePreset,
      colors: iteration.generationInput.colors,
      roomType: iteration.generationInput.roomType,
      prompt: iteration.generationInput.prompt,
      referenceAssets: iteration.generationInput.referenceAssets,
    },
    inputAssets: iteration.inputAssets.map((asset) => ({
      assetId: asset.assetId,
      role: asset.role,
      mimeType: asset.mimeType,
      sizeBytes: asset.sizeBytes,
    })),
    outputAsset: iteration.outputAsset
      ? {
          assetId: iteration.outputAsset.assetId,
          role: iteration.outputAsset.role,
          mimeType: iteration.outputAsset.mimeType,
          sizeBytes: iteration.outputAsset.sizeBytes,
        }
      : null,
    result: {
      imageAssetId: iteration.result.imageAssetId,
    },
    createdAt: iteration.createdAt.toISOString(),
  };
};

@Injectable()
export class MapVisualizationDetailsService {
  map = (params: { visualizationDocument: TVisualizationDocument }) => {
    const { visualizationDocument } = params;

    return {
      id: visualizationDocument._id.toString(),
      projectId: visualizationDocument.projectId.toString(),
      name: visualizationDocument.name,
      iterations: visualizationDocument.iterations.map((iteration) => mapIteration({ iteration })),
      createdAt: visualizationDocument.createdAt.toISOString(),
      updatedAt: visualizationDocument.updatedAt.toISOString(),
    };
  };
}

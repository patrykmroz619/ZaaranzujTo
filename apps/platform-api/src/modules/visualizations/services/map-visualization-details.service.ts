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
      stylePreset: visualizationDocument.stylePreset,
      palette: visualizationDocument.palette,
      roomType: visualizationDocument.roomType,
      iterations: visualizationDocument.iterations.map((iteration) => mapIteration({ iteration })),
      createdAt: visualizationDocument.createdAt.toISOString(),
      updatedAt: visualizationDocument.updatedAt.toISOString(),
    };
  };
}

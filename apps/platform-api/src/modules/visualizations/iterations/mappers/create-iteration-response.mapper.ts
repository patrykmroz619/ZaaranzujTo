import { Injectable } from "@nestjs/common";

import type { TVisualizationDocument } from "../../schemas/visualization.schema";

type TMapCreateIterationResponseParams = {
  visualizationDocument: TVisualizationDocument;
};

@Injectable()
export class CreateIterationResponseMapper {
  map = (params: TMapCreateIterationResponseParams) => {
    const { visualizationDocument } = params;

    const iteration = visualizationDocument.iterations[visualizationDocument.iterations.length - 1];

    return {
      iteration: {
        iterationId: iteration._id.toString(),
        visualizationId: visualizationDocument._id.toString(),
        status: iteration.status,
        sequenceNumber: iteration.iterationNo,
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
          : undefined,
        failureCode: iteration.failureCode ?? undefined,
        createdAt: iteration.createdAt.toISOString(),
      },
    };
  };
}

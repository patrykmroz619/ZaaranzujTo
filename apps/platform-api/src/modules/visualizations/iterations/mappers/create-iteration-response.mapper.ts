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
        outputAsset: iteration.outputAsset ?? undefined,
        failureCode: iteration.failureCode ?? undefined,
        createdAt: iteration.createdAt.toISOString(),
      },
    };
  };
}

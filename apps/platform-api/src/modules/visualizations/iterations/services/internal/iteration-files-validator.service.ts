import { Injectable } from "@nestjs/common";

import {
  CREATE_ITERATION_ALLOWED_MIME_PREFIX,
  CREATE_ITERATION_MAX_FILE_SIZE_BYTES,
} from "../../../visualizations.dto";
import { toIterationOrchestrationHttpException } from "../../../errors/iteration-orchestration.errors";
import type { TUploadedFile } from "./iteration.types";

type TValidateFilesParams = {
  inputPhoto: TUploadedFile | undefined;
  inspirationPhoto: TUploadedFile | undefined;
  referencePhotos: TUploadedFile[];
};

@Injectable()
export class IterationFilesValidatorService {
  validateFiles = (params: TValidateFilesParams) => {
    const { inputPhoto, inspirationPhoto, referencePhotos } = params;

    if (inputPhoto) {
      this.validateFile({ file: inputPhoto });
    }
    if (inspirationPhoto) {
      this.validateFile({ file: inspirationPhoto });
    }
    referencePhotos.forEach((file) => this.validateFile({ file }));
  };

  private validateFile = (params: { file: TUploadedFile }) => {
    const { file } = params;

    if (!file.mimetype.startsWith(CREATE_ITERATION_ALLOWED_MIME_PREFIX)) {
      throw toIterationOrchestrationHttpException({ code: "INVALID_INPUT" });
    }

    if (file.size > CREATE_ITERATION_MAX_FILE_SIZE_BYTES) {
      throw toIterationOrchestrationHttpException({ code: "FILE_TOO_LARGE" });
    }
  };
}

import { HttpException, HttpStatus } from "@nestjs/common";

export type TIterationOrchestrationErrorCode =
  | "INSUFFICIENT_CREDITS"
  | "FILE_TOO_LARGE"
  | "INVALID_INPUT"
  | "UPSTREAM_GENERATION_FAILURE"
  | "ACTIVE_GENERATION_CONFLICT";

type TIterationOrchestrationErrorDefinition = {
  statusCode: HttpStatus;
  message: string;
};

const iterationOrchestrationErrorsMap: Record<
  TIterationOrchestrationErrorCode,
  TIterationOrchestrationErrorDefinition
> = {
  INSUFFICIENT_CREDITS: {
    statusCode: HttpStatus.PAYMENT_REQUIRED,
    message: "Insufficient credits.",
  },
  FILE_TOO_LARGE: {
    statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
    message: "Uploaded file is too large.",
  },
  INVALID_INPUT: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: "Invalid iteration input.",
  },
  UPSTREAM_GENERATION_FAILURE: {
    statusCode: HttpStatus.BAD_GATEWAY,
    message: "Generation provider request failed.",
  },
  ACTIVE_GENERATION_CONFLICT: {
    statusCode: HttpStatus.CONFLICT,
    message: "Another generation is currently active for this visualization.",
  },
};

export const toIterationOrchestrationHttpException = (params: {
  code: TIterationOrchestrationErrorCode;
  details?: unknown;
}): HttpException => {
  const { code, details } = params;
  const definition = iterationOrchestrationErrorsMap[code];

  return new HttpException(
    {
      code,
      message: definition.message,
      details,
    },
    definition.statusCode,
  );
};

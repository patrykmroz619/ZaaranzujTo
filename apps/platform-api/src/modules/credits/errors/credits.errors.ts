import { HttpException, HttpStatus } from "@nestjs/common";

export type TCreditsErrorCode =
  | "INSUFFICIENT_CREDITS"
  | "CREDIT_ACCOUNT_NOT_FOUND"
  | "IDEMPOTENCY_CONFLICT"
  | "RESERVATION_NOT_FOUND"
  | "RESERVATION_ALREADY_FINALIZED";

type TCreditsErrorDefinition = {
  statusCode: HttpStatus;
  message: string;
};

const creditsErrorsMap: Record<TCreditsErrorCode, TCreditsErrorDefinition> = {
  INSUFFICIENT_CREDITS: {
    statusCode: HttpStatus.PAYMENT_REQUIRED,
    message: "Insufficient credits.",
  },
  CREDIT_ACCOUNT_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    message: "Credit account not found.",
  },
  IDEMPOTENCY_CONFLICT: {
    statusCode: HttpStatus.CONFLICT,
    message: "Idempotency key conflict.",
  },
  RESERVATION_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    message: "Credit reservation not found.",
  },
  RESERVATION_ALREADY_FINALIZED: {
    statusCode: HttpStatus.CONFLICT,
    message: "Credit reservation already finalized.",
  },
};

export const toCreditsHttpException = (params: {
  code: TCreditsErrorCode;
  details?: unknown;
}): HttpException => {
  const { code, details } = params;
  const definition = creditsErrorsMap[code];

  return new HttpException(
    {
      code,
      message: definition.message,
      details,
    },
    definition.statusCode,
  );
};

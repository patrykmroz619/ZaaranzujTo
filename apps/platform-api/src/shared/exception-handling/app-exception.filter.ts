import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";

import { REQUEST_ID_HEADER } from "../request-context";
import type { TErrorResponse } from "./error-response.type";

type TRequestWithContext = Request & {
  requestId?: string;
};

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch = (exception: unknown, host: ArgumentsHost): void => {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<TRequestWithContext>();

    const requestId = request.requestId ?? randomUUID();
    response.setHeader(REQUEST_ID_HEADER, requestId);

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const defaultMessage =
      statusCode >= 500 ? "Internal server error" : "Request failed";

    const errorResponse: TErrorResponse = {
      statusCode,
      message: defaultMessage,
      requestId,
    };

    if (isHttpException) {
      const source = exception.getResponse();

      if (typeof source === "string") {
        errorResponse.message = source;
      } else if (source && typeof source === "object") {
        const sourceObject = source as Record<string, unknown>;
        const sourceMessage = sourceObject["message"];

        if (typeof sourceMessage === "string") {
          errorResponse.message = sourceMessage;
        }

        if (
          Array.isArray(sourceMessage) ||
          sourceObject["details"] !== undefined
        ) {
          errorResponse.details = sourceObject["details"] ?? sourceMessage;
        }
      }
    }

    response.status(statusCode).json(errorResponse);
  };
}

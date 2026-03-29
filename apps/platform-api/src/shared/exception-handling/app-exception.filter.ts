import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";

import { REQUEST_ID_HEADER } from "../request-context";
import type { TErrorResponse } from "./error-response.type";

type TRequestWithContext = Request<unknown, unknown, unknown> & {
  requestId?: string;
};

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch = (exception: unknown, host: ArgumentsHost): void => {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<TRequestWithContext>();

    const requestId = request.requestId ?? randomUUID();
    response.setHeader(REQUEST_ID_HEADER, requestId);

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const defaultMessage = statusCode >= 500 ? "Internal server error" : "Request failed";

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

        if (Array.isArray(sourceMessage) || sourceObject["details"] !== undefined) {
          errorResponse.details = sourceObject["details"] ?? sourceMessage;
        }
      }
    }

    const logPayload = JSON.stringify({
      requestId,
      method: request.method,
      route: request.originalUrl,
      statusCode,
      error: exception instanceof Error ? exception.message : String(exception),
      stack: exception instanceof Error ? exception.stack : undefined,
      cause:
        exception instanceof Error && exception.cause instanceof Error
          ? exception.cause.message
          : undefined,
      body: request.body,
      params: request.params,
      query: request.query,
    });

    if (statusCode >= 500) {
      this.logger.error(logPayload);
    } else {
      this.logger.warn(logPayload);
    }

    response.status(statusCode).json(errorResponse);
  };
}

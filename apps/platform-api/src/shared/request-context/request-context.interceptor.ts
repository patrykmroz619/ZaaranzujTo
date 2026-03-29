import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { Observable, tap } from "rxjs";

import { REQUEST_ID_HEADER } from "./request.constants";

type TRequestWithContext = Request & {
  requestId?: string;
};

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestContextInterceptor.name);

  intercept = (context: ExecutionContext, next: CallHandler): Observable<unknown> => {
    const request = context.switchToHttp().getRequest<TRequestWithContext>();
    const response = context.switchToHttp().getResponse<Response>();

    const requestId = randomUUID();
    const startTime = Date.now();

    request.requestId = requestId;
    response.setHeader(REQUEST_ID_HEADER, requestId);

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          JSON.stringify({
            requestId,
            method: request.method,
            route: request.originalUrl,
            statusCode: response.statusCode,
            durationMs: Date.now() - startTime,
          }),
        );
      }),
    );
  };
}

import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

import type { TAuthData, TAuthenticatedRequest } from "./auth.types";

const currentUserDecoratorFactory = createParamDecorator(
  (_: unknown, context: ExecutionContext): TAuthData => {
    const request = context.switchToHttp().getRequest<TAuthenticatedRequest>();

    if (!request.auth) {
      throw new UnauthorizedException();
    }

    return request.auth;
  },
);

export const CurrentUser = currentUserDecoratorFactory;

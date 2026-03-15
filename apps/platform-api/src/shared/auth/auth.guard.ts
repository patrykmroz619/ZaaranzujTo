import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { verifyToken } from "@clerk/backend";
import { TAuthenticatedRequest } from "./auth.types";

export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TAuthenticatedRequest>();

    const env = process.env["ENV"];
    const skipAuthInLocalEnv =
      process.env["SKIP_AUTH_FOR_LOCAL_ENV"] === "true";

    if (env === "local" && skipAuthInLocalEnv) {
      request.auth = {
        userId: request.headers["user-id"] as string,
        email: request.headers["user-email"] as string,
      };

      return true;
    }

    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    const secretKey = process.env["CLERK_SECRET_KEY"];
    const authorizedParties = process.env["AUTHORIZED_PARTIES"]?.split(",");

    if (!secretKey || !authorizedParties) {
      console.error(
        "Missing configuration for secret key or authorized parties.",
      );
      throw new UnauthorizedException();
    }

    try {
      const payload = await verifyToken(token, {
        secretKey,
        authorizedParties,
      });

      request.auth = {
        userId: payload.sub,
        email: payload["email"] as string,
      };

      return true;
    } catch (error) {
      console.error("Token verification failed:", error);
      throw new UnauthorizedException();
    }
  }
}

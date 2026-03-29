import { createHash, timingSafeEqual } from "node:crypto";

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { ConfigType } from "@/config/config.module";

const hashApiKey = (apiKey: string): Buffer => createHash("sha256").update(apiKey).digest();

const areApiKeysEqual = (providedApiKey: string, configuredApiKey: string): boolean => {
  const providedHash = hashApiKey(providedApiKey);
  const configuredHash = hashApiKey(configuredApiKey);

  return timingSafeEqual(providedHash, configuredHash);
};

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(private readonly configService: ConfigService<ConfigType>) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();

    const configuredApiKey = this.configService.get<string>("manualTopupApiKey");

    if (!configuredApiKey) {
      this.logger.error("MANUAL_TOPUP_API_KEY is missing. Rejecting API key request.");
      throw new UnauthorizedException();
    }

    const rawApiKeyHeader = request.headers["x-api-key"];
    const providedApiKey = Array.isArray(rawApiKeyHeader) ? rawApiKeyHeader[0] : rawApiKeyHeader;

    if (typeof providedApiKey !== "string" || providedApiKey.length === 0) {
      throw new UnauthorizedException();
    }

    if (!areApiKeysEqual(providedApiKey, configuredApiKey)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}

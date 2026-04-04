import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

import { AppModule } from "./app.module";
import { ZodValidationPipe } from "nestjs-zod";
import { AppExceptionFilter } from "./shared/exception-handling";
import { RequestContextInterceptor } from "./shared/request-context";
import { AppLogger } from "./shared/logging";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const logDir = configService.getOrThrow<string>("logDir");
  app.useLogger(new AppLogger({ prefix: "Platform API", logDir }));

  const port = configService.getOrThrow<number>("port");

  app.enableCors();

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalInterceptors(new RequestContextInterceptor());

  await app.listen(port);
}

void bootstrap();

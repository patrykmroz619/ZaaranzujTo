import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

import { AppModule } from "./app.module";
import { ZodValidationPipe } from "nestjs-zod";
import { AppExceptionFilter } from "./shared/exception-handling";
import { RequestContextInterceptor } from "./shared/request-context";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.getOrThrow<number>("port");

  app.enableCors();

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(new ZodValidationPipe());
  // app.useGlobalInterceptors(new RequestContextInterceptor());
  app.useGlobalFilters(new AppExceptionFilter());

  await app.listen(port);
}

void bootstrap();

import { ConsoleLogger, INestApplication } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces";
import { Test } from "@nestjs/testing";
import { ZodValidationPipe } from "nestjs-zod";

import { AppExceptionFilter } from "../../src/shared/exception-handling";
import { RequestContextInterceptor } from "../../src/shared/request-context";

type TCreateTestAppInput = {
  useGlobalPrefix?: boolean;
  moduleMetadata: ModuleMetadata;
};

export const createTestApp = async (input: TCreateTestAppInput) => {
  const moduleFixture = await Test.createTestingModule({
    imports: input.moduleMetadata.imports ?? [],
    controllers: input.moduleMetadata.controllers ?? [],
    providers: input.moduleMetadata.providers ?? [],
    exports: input.moduleMetadata.exports ?? [],
  }).compile();

  const app = moduleFixture.createNestApplication({
    logger: new ConsoleLogger({ prefix: "Platform API Test" }),
  });

  if (input.useGlobalPrefix ?? true) {
    app.setGlobalPrefix("api/v1");
  }

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(new RequestContextInterceptor());
  app.useGlobalFilters(new AppExceptionFilter());

  await app.init();

  return app;
};

export const closeTestApp = async (app?: INestApplication) => {
  if (!app) {
    return;
  }

  await app.close();
};

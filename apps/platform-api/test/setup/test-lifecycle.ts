import { INestApplication } from "@nestjs/common";
import { runRegisteredCleanup } from "../helpers";

const appRegistry = new Set<INestApplication>();

export const registerTestApp = (app: INestApplication) => {
  appRegistry.add(app);
  return app;
};

export const cleanupRegisteredApps = async () => {
  for (const app of appRegistry) {
    await app.close();
  }

  appRegistry.clear();
};

afterEach(async () => {
  await runRegisteredCleanup();
  jest.clearAllMocks();
});

afterAll(async () => {
  await cleanupRegisteredApps();
});

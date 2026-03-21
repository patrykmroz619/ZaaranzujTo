import { INestApplication } from "@nestjs/common";
import { clearDatabaseForApp, runRegisteredCleanup } from "../helpers";

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

  for (const app of appRegistry) {
    await clearDatabaseForApp({ app });
  }
});

afterAll(async () => {
  await cleanupRegisteredApps();
});

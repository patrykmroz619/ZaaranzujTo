import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";

import { HealthModule } from "../src/modules/health/health.module";
import { createTestApp } from "./setup/create-test-app";
import { registerTestApp } from "./setup/test-lifecycle";

describe("Health smoke (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = registerTestApp(
      await createTestApp({
        moduleMetadata: {
          imports: [HealthModule],
        },
      }),
    );
  });

  it("should return status ok", async () => {
    const response = await request(app.getHttpServer() as App)
      .get("/api/v1/health/")
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: "ok" });
  });
});

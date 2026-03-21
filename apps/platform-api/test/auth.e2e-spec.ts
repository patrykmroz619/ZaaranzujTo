import request from "supertest";
import { Controller, Get, INestApplication, UseGuards } from "@nestjs/common";
import { App } from "supertest/types";

import { AuthGuard } from "../src/shared/auth";
import { createTestApp } from "./setup/create-test-app";
import { registerTestApp } from "./setup/test-lifecycle";

@Controller("protected")
class ProtectedTestController {
  @Get()
  @UseGuards(AuthGuard)
  getProtected() {
    return {
      ok: true,
    };
  }
}

describe("Profile auth (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = registerTestApp(
      await createTestApp({
        moduleMetadata: {
          controllers: [ProtectedTestController],
          providers: [AuthGuard],
        },
      }),
    );
  });

  it("should return 401 when no auth provided", async () => {
    const response = await request(app.getHttpServer() as App)
      .get("/api/v1/protected")
      .expect(401);

    expect(response.status).toBe(401);
  });
});

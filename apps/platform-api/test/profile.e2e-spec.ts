import request from "supertest";
import { type INestApplication } from "@nestjs/common";
import { type App } from "supertest/types";

import { ConfigurationModule } from "../src/config/config.module";
import { DatabaseModule } from "../src/database/database.module";
import { ProfileModule } from "../src/modules/profile/profile.module";
import { buildTestUserFixture } from "./fixtures/test-user.fixture";
import {
  applyLocalAuthBypassEnv,
  authenticatedDelete,
  authenticatedGet,
  authenticatedPatch,
  type TAuthContext,
} from "./helpers";
import { createTestApp } from "./setup/create-test-app";
import { registerTestApp } from "./setup/test-lifecycle";

type TUserObject = {
  id: string;
  clerkUserId: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type TMeResponseBody = {
  user: TUserObject;
  creditBalance: number;
  theme: string;
};

type TErrorResponseBody = {
  statusCode: number;
  message: string;
  requestId: string;
  details?: unknown;
};

const profilePath = "/api/v1/me";

const buildAuthContext = (): TAuthContext => {
  return buildTestUserFixture();
};

const getMeResponseBody = (response: { body: unknown }) => {
  return response.body as TMeResponseBody;
};

const getErrorResponseBody = (response: { body: unknown }) => {
  return response.body as TErrorResponseBody;
};

describe("Profile module (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    applyLocalAuthBypassEnv();

    app = registerTestApp(
      await createTestApp({
        moduleMetadata: {
          imports: [ConfigurationModule, DatabaseModule, ProfileModule],
        },
      }),
    );
  });

  describe("GET /api/v1/me", () => {
    it("should return 401 when no auth provided", async () => {
      const response = await request(app.getHttpServer() as App)
        .get(profilePath)
        .expect(401);
      const errorBody = getErrorResponseBody(response);

      expect(errorBody.statusCode).toBe(401);
      expect(typeof errorBody.requestId).toBe("string");
    });

    it("should provision and return current user profile", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedGet({
        app,
        path: profilePath,
        auth,
      }).expect(200);
      const meBody = getMeResponseBody(response);

      expect(meBody.user.clerkUserId).toBe(auth.userId);
      expect(meBody.user.email).toBe(auth.email);
      expect(typeof meBody.user.id).toBe("string");
      expect(typeof meBody.user.createdAt).toBe("string");
      expect(typeof meBody.user.updatedAt).toBe("string");
      expect(meBody.creditBalance).toBe(0);
      expect(meBody.theme).toBe("system");
    });

    it("should update email on reprovision while preserving other user data", async () => {
      const seed = buildAuthContext();
      const changedEmail = `changed-${seed.email}`;

      await authenticatedGet({
        app,
        path: profilePath,
        auth: seed,
      }).expect(200);

      const response = await authenticatedGet({
        app,
        path: profilePath,
        auth: {
          userId: seed.userId,
          email: changedEmail,
        },
      }).expect(200);
      const meBody = getMeResponseBody(response);

      expect(meBody.user.clerkUserId).toBe(seed.userId);
      expect(meBody.user.email).toBe(changedEmail);
    });
  });

  describe("PATCH /api/v1/me", () => {
    it("should return 401 when no auth provided", async () => {
      const response = await request(app.getHttpServer() as App)
        .patch(profilePath)
        .send({ theme: "dark" })
        .expect(401);
      const errorBody = getErrorResponseBody(response);

      expect(errorBody.statusCode).toBe(401);
      expect(typeof errorBody.requestId).toBe("string");
    });

    it("should update theme and persist it", async () => {
      const auth = buildAuthContext();

      await authenticatedGet({
        app,
        path: profilePath,
        auth,
      }).expect(200);

      const patchResponse = await authenticatedPatch({
        app,
        path: profilePath,
        auth,
        body: { theme: "dark" },
      }).expect(200);
      const patchBody = getMeResponseBody(patchResponse);

      expect(patchBody.theme).toBe("dark");

      const getResponse = await authenticatedGet({
        app,
        path: profilePath,
        auth,
      }).expect(200);
      const meBody = getMeResponseBody(getResponse);

      expect(meBody.theme).toBe("dark");
    });

    it("should accept all valid theme values", async () => {
      const auth = buildAuthContext();

      await authenticatedGet({ app, path: profilePath, auth }).expect(200);

      for (const theme of ["light", "dark", "system"] as const) {
        const response = await authenticatedPatch({
          app,
          path: profilePath,
          auth,
          body: { theme },
        }).expect(200);

        expect(getMeResponseBody(response).theme).toBe(theme);
      }
    });

    it("should return 400 for empty body", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedPatch({
        app,
        path: profilePath,
        auth,
        body: {},
      }).expect(400);
      const errorBody = getErrorResponseBody(response);

      expect(errorBody.statusCode).toBe(400);
      expect(typeof errorBody.requestId).toBe("string");
      expect(errorBody.message).toBe("Validation failed");
    });

    it("should return 400 for invalid theme value", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedPatch({
        app,
        path: profilePath,
        auth,
        body: { theme: "rainbow" },
      }).expect(400);
      const errorBody = getErrorResponseBody(response);

      expect(errorBody.statusCode).toBe(400);
      expect(typeof errorBody.requestId).toBe("string");
      expect(errorBody.message).toBe("Validation failed");
    });
  });

  describe("DELETE /api/v1/me", () => {
    it("should return 401 when no auth provided", async () => {
      const response = await request(app.getHttpServer() as App)
        .delete(profilePath)
        .expect(401);
      const errorBody = getErrorResponseBody(response);

      expect(errorBody.statusCode).toBe(401);
      expect(typeof errorBody.requestId).toBe("string");
    });

    it("should return 400 when confirm field is missing", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedDelete({
        app,
        path: profilePath,
        auth,
        body: {},
      }).expect(400);
      const errorBody = getErrorResponseBody(response);

      expect(errorBody.statusCode).toBe(400);
      expect(typeof errorBody.requestId).toBe("string");
      expect(errorBody.message).toBe("Validation failed");
    });

    it("should return 400 when confirm is not true", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedDelete({
        app,
        path: profilePath,
        auth,
        body: { confirm: false },
      }).expect(400);
      const errorBody = getErrorResponseBody(response);

      expect(errorBody.statusCode).toBe(400);
      expect(typeof errorBody.requestId).toBe("string");
      expect(errorBody.message).toBe("Validation failed");
    });

    it("should return 501 placeholder response for authenticated user with valid body", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedDelete({
        app,
        path: profilePath,
        auth,
        body: { confirm: true },
      }).expect(501);
      const errorBody = getErrorResponseBody(response);

      expect(errorBody.statusCode).toBe(501);
      expect(errorBody.message).toContain("DELETE /me is not implemented");
      expect(typeof errorBody.requestId).toBe("string");
    });
  });
});

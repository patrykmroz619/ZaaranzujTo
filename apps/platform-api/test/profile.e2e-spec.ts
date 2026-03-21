import request from "supertest";
import { type INestApplication } from "@nestjs/common";
import { type App } from "supertest/types";

import { ConfigurationModule } from "../src/config/config.module";
import { DatabaseModule } from "../src/database/database.module";
import { ProfileModule } from "../src/modules/profile/profile.module";
import { fixtureEmail } from "./fixtures/factory";
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

type TMeResponseBody = {
  userId: string;
  email: string;
  profile: {
    nickname: string;
  };
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

const buildAnotherEmail = () => {
  return fixtureEmail();
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
      const expectedNickname = auth.email.split("@")[0]?.trim() ?? "User";

      const response = await authenticatedGet({
        app,
        path: profilePath,
        auth,
      }).expect(200);
      const meBody = getMeResponseBody(response);

      expect(meBody).toEqual({
        userId: auth.userId,
        email: auth.email,
        profile: {
          nickname: expectedNickname.length > 0 ? expectedNickname : "User",
        },
      });
    });

    it("should update email on reprovision while preserving existing nickname", async () => {
      const seed = buildAuthContext();
      const changedEmail = buildAnotherEmail();
      const firstNickname = seed.email.split("@")[0]?.trim() ?? "User";

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

      expect(meBody.userId).toBe(seed.userId);
      expect(meBody.email).toBe(changedEmail);
      expect(meBody.profile.nickname).toBe(firstNickname.length > 0 ? firstNickname : "User");
    });
  });

  describe("PATCH /api/v1/me", () => {
    it("should return 401 when no auth provided", async () => {
      const response = await request(app.getHttpServer() as App)
        .patch(profilePath)
        .send({ nickname: "AnyNickname" })
        .expect(401);
      const errorBody = getErrorResponseBody(response);

      expect(errorBody.statusCode).toBe(401);
      expect(typeof errorBody.requestId).toBe("string");
    });

    it("should update nickname and persist it", async () => {
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
        body: { nickname: "NowyNick" },
      }).expect(200);
      const patchBody = getMeResponseBody(patchResponse);

      expect(patchBody.profile.nickname).toBe("NowyNick");

      const getResponse = await authenticatedGet({
        app,
        path: profilePath,
        auth,
      }).expect(200);
      const meBody = getMeResponseBody(getResponse);

      expect(meBody.profile.nickname).toBe("NowyNick");
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

    it("should return 400 for nickname longer than 32 chars", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedPatch({
        app,
        path: profilePath,
        auth,
        body: { nickname: "a".repeat(33) },
      }).expect(400);
      const errorBody = getErrorResponseBody(response);

      expect(errorBody.statusCode).toBe(400);
      expect(typeof errorBody.requestId).toBe("string");
      expect(errorBody.message).toBe("Validation failed");
    });

    it("should return 400 for nickname containing control characters", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedPatch({
        app,
        path: profilePath,
        auth,
        body: { nickname: "abc\u0007def" },
      }).expect(400);
      const errorBody = getErrorResponseBody(response);

      expect(errorBody.statusCode).toBe(400);
      expect(typeof errorBody.requestId).toBe("string");
      expect(errorBody.message).toBe("Validation failed");
    });

    it("should return 400 for whitespace-only nickname", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedPatch({
        app,
        path: profilePath,
        auth,
        body: { nickname: "     " },
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

    it("should return 501 placeholder response for authenticated user", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedDelete({
        app,
        path: profilePath,
        auth,
      }).expect(501);
      const errorBody = getErrorResponseBody(response);

      expect(errorBody.statusCode).toBe(501);
      expect(errorBody.message).toContain("DELETE /me is not implemented");
      expect(typeof errorBody.requestId).toBe("string");
    });
  });
});

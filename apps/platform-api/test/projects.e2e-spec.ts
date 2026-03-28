import request from "supertest";
import { type INestApplication } from "@nestjs/common";
import { type App } from "supertest/types";

import { ConfigurationModule } from "../src/config/config.module";
import { DatabaseModule } from "../src/database/database.module";
import { ProjectsModule } from "../src/modules/projects/projects.module";
import { buildTestUserFixture } from "./fixtures/test-user.fixture";
import {
  applyLocalAuthBypassEnv,
  authenticatedDelete,
  authenticatedGet,
  authenticatedPatch,
  authenticatedPost,
  type TAuthContext,
} from "./helpers";
import { createTestApp } from "./setup/create-test-app";
import { registerTestApp } from "./setup/test-lifecycle";

type TProjectResponseBody = {
  id: string;
  name: string;
  visualizationsCount: number;
  createdAt: string;
  updatedAt: string;
};

type TListProjectsResponseBody = {
  items: TProjectResponseBody[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

type TDeleteProjectResponseBody = {
  deleted: true;
  projectId: string;
};

type TErrorResponseBody = {
  statusCode: number;
  message: string;
  requestId: string;
  details?: unknown;
};

const projectsPath = "/api/v1/projects";

const projectPath = (projectId: string) => `${projectsPath}/${projectId}`;

const buildAuthContext = (): TAuthContext => {
  return buildTestUserFixture();
};

const getProjectBody = (response: { body: unknown }) => {
  return response.body as TProjectResponseBody;
};

const getListBody = (response: { body: unknown }) => {
  return response.body as TListProjectsResponseBody;
};

const getDeleteBody = (response: { body: unknown }) => {
  return response.body as TDeleteProjectResponseBody;
};

const getErrorBody = (response: { body: unknown }) => {
  return response.body as TErrorResponseBody;
};

const createProject = async (app: INestApplication, auth: TAuthContext, name = "Test Project") => {
  const response = await authenticatedPost({
    app,
    path: projectsPath,
    auth,
    body: { name },
  }).expect(201);

  return getProjectBody(response);
};

const fakeObjectId = "aaaaaaaaaaaaaaaaaaaaaaaa";

describe("Projects module (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    applyLocalAuthBypassEnv();

    app = registerTestApp(
      await createTestApp({
        moduleMetadata: {
          imports: [ConfigurationModule, DatabaseModule, ProjectsModule],
        },
      }),
    );
  });

  describe("GET /api/v1/projects", () => {
    it("should return 401 when no auth provided", async () => {
      const response = await request(app.getHttpServer() as App)
        .get(projectsPath)
        .expect(401);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(401);
      expect(typeof errorBody.requestId).toBe("string");
    });

    it("should return empty list for new user", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedGet({
        app,
        path: projectsPath,
        auth,
      }).expect(200);
      const body = getListBody(response);

      expect(body.items).toEqual([]);
      expect(body.pagination).toEqual({
        page: 1,
        pageSize: 20,
        totalItems: 0,
        totalPages: 0,
      });
    });

    it("should return created projects with correct shape", async () => {
      const auth = buildAuthContext();
      await createProject(app, auth, "Mieszkanie 2026");

      const response = await authenticatedGet({
        app,
        path: projectsPath,
        auth,
      }).expect(200);
      const body = getListBody(response);

      expect(body.items).toHaveLength(1);
      expect(body.items[0]).toEqual(
        expect.objectContaining({
          name: "Mieszkanie 2026",
          visualizationsCount: 0,
        }),
      );
      expect(typeof body.items[0]!.id).toBe("string");
      expect(typeof body.items[0]!.createdAt).toBe("string");
      expect(typeof body.items[0]!.updatedAt).toBe("string");
    });

    it("should paginate results", async () => {
      const auth = buildAuthContext();
      await createProject(app, auth, "Project 1");
      await createProject(app, auth, "Project 2");
      await createProject(app, auth, "Project 3");

      const page1Response = await authenticatedGet({
        app,
        path: `${projectsPath}?pageSize=2&page=1`,
        auth,
      }).expect(200);
      const page1 = getListBody(page1Response);

      expect(page1.items).toHaveLength(2);
      expect(page1.pagination).toEqual({
        page: 1,
        pageSize: 2,
        totalItems: 3,
        totalPages: 2,
      });

      const page2Response = await authenticatedGet({
        app,
        path: `${projectsPath}?pageSize=2&page=2`,
        auth,
      }).expect(200);
      const page2 = getListBody(page2Response);

      expect(page2.items).toHaveLength(1);
      expect(page2.pagination.page).toBe(2);
    });

    it("should sort by createdAt desc by default", async () => {
      const auth = buildAuthContext();
      await createProject(app, auth, "First");
      await createProject(app, auth, "Second");

      const response = await authenticatedGet({
        app,
        path: projectsPath,
        auth,
      }).expect(200);
      const body = getListBody(response);

      expect(body.items).toHaveLength(2);
      expect(body.items[0]!.name).toBe("Second");
      expect(body.items[1]!.name).toBe("First");
    });

    it("should isolate projects between users", async () => {
      const authA = buildAuthContext();
      const authB = buildAuthContext();
      await createProject(app, authA, "User A Project");
      await createProject(app, authB, "User B Project");

      const responseA = await authenticatedGet({
        app,
        path: projectsPath,
        auth: authA,
      }).expect(200);
      const bodyA = getListBody(responseA);

      expect(bodyA.items).toHaveLength(1);
      expect(bodyA.items[0]!.name).toBe("User A Project");

      const responseB = await authenticatedGet({
        app,
        path: projectsPath,
        auth: authB,
      }).expect(200);
      const bodyB = getListBody(responseB);

      expect(bodyB.items).toHaveLength(1);
      expect(bodyB.items[0]!.name).toBe("User B Project");
    });

    it("should return 400 for pageSize exceeding 100", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedGet({
        app,
        path: `${projectsPath}?pageSize=101`,
        auth,
      }).expect(400);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(400);
      expect(typeof errorBody.requestId).toBe("string");
    });

    it("should return 400 for invalid sort value", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedGet({
        app,
        path: `${projectsPath}?sort=invalid`,
        auth,
      }).expect(400);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(400);
      expect(typeof errorBody.requestId).toBe("string");
    });
  });

  describe("POST /api/v1/projects", () => {
    it("should return 401 when no auth provided", async () => {
      const response = await request(app.getHttpServer() as App)
        .post(projectsPath)
        .send({ name: "Test" })
        .expect(401);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(401);
      expect(typeof errorBody.requestId).toBe("string");
    });

    it("should create project with valid name", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedPost({
        app,
        path: projectsPath,
        auth,
        body: { name: "Mieszkanie 2026" },
      }).expect(201);
      const body = getProjectBody(response);

      expect(body.name).toBe("Mieszkanie 2026");
      expect(body.visualizationsCount).toBe(0);
      expect(typeof body.id).toBe("string");
      expect(typeof body.createdAt).toBe("string");
      expect(typeof body.updatedAt).toBe("string");
    });

    it("should return 400 for missing name", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedPost({
        app,
        path: projectsPath,
        auth,
        body: {},
      }).expect(400);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(400);
      expect(typeof errorBody.requestId).toBe("string");
    });

    it("should return 400 for empty string name", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedPost({
        app,
        path: projectsPath,
        auth,
        body: { name: "" },
      }).expect(400);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(400);
    });

    it("should return 400 for whitespace-only name", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedPost({
        app,
        path: projectsPath,
        auth,
        body: { name: "   " },
      }).expect(400);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(400);
    });

    it("should return 400 for name exceeding 120 characters", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedPost({
        app,
        path: projectsPath,
        auth,
        body: { name: "a".repeat(121) },
      }).expect(400);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(400);
    });

    it("should return 400 for name with control characters", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedPost({
        app,
        path: projectsPath,
        auth,
        body: { name: "abc\x00def" },
      }).expect(400);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(400);
    });
  });

  describe("GET /api/v1/projects/:projectId", () => {
    it("should return 401 when no auth provided", async () => {
      const response = await request(app.getHttpServer() as App)
        .get(projectPath(fakeObjectId))
        .expect(401);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(401);
      expect(typeof errorBody.requestId).toBe("string");
    });

    it("should return project owned by user", async () => {
      const auth = buildAuthContext();
      const created = await createProject(app, auth, "My Project");

      const response = await authenticatedGet({
        app,
        path: projectPath(created.id),
        auth,
      }).expect(200);
      const body = getProjectBody(response);

      expect(body.id).toBe(created.id);
      expect(body.name).toBe("My Project");
      expect(body.visualizationsCount).toBe(0);
    });

    it("should return 404 for nonexistent project", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedGet({
        app,
        path: projectPath(fakeObjectId),
        auth,
      }).expect(404);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(404);
      expect(typeof errorBody.requestId).toBe("string");
    });

    it("should return 404 for project belonging to another user", async () => {
      const authOwner = buildAuthContext();
      const authOther = buildAuthContext();
      const created = await createProject(app, authOwner, "Owner Project");

      const response = await authenticatedGet({
        app,
        path: projectPath(created.id),
        auth: authOther,
      }).expect(404);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(404);
    });

    it("should return 400 for invalid projectId format", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedGet({
        app,
        path: projectPath("not-a-valid-id"),
        auth,
      }).expect(400);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(400);
    });
  });

  describe("PATCH /api/v1/projects/:projectId", () => {
    it("should return 401 when no auth provided", async () => {
      const response = await request(app.getHttpServer() as App)
        .patch(projectPath(fakeObjectId))
        .send({ name: "Updated" })
        .expect(401);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(401);
      expect(typeof errorBody.requestId).toBe("string");
    });

    it("should update project name", async () => {
      const auth = buildAuthContext();
      const created = await createProject(app, auth, "Original Name");

      const response = await authenticatedPatch({
        app,
        path: projectPath(created.id),
        auth,
        body: { name: "Updated Name" },
      }).expect(200);
      const body = getProjectBody(response);

      expect(body.id).toBe(created.id);
      expect(body.name).toBe("Updated Name");
      expect(body.updatedAt).not.toBe(created.updatedAt);
    });

    it("should return 400 for empty body", async () => {
      const auth = buildAuthContext();
      const created = await createProject(app, auth, "Some Project");

      const response = await authenticatedPatch({
        app,
        path: projectPath(created.id),
        auth,
        body: {},
      }).expect(400);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(400);
    });

    it("should return 400 for name exceeding 120 characters", async () => {
      const auth = buildAuthContext();
      const created = await createProject(app, auth, "Some Project");

      const response = await authenticatedPatch({
        app,
        path: projectPath(created.id),
        auth,
        body: { name: "a".repeat(121) },
      }).expect(400);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(400);
    });

    it("should return 400 for name with control characters", async () => {
      const auth = buildAuthContext();
      const created = await createProject(app, auth, "Some Project");

      const response = await authenticatedPatch({
        app,
        path: projectPath(created.id),
        auth,
        body: { name: "abc\x07def" },
      }).expect(400);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(400);
    });

    it("should return 400 for whitespace-only name", async () => {
      const auth = buildAuthContext();
      const created = await createProject(app, auth, "Some Project");

      const response = await authenticatedPatch({
        app,
        path: projectPath(created.id),
        auth,
        body: { name: "     " },
      }).expect(400);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(400);
    });

    it("should return 404 for nonexistent project", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedPatch({
        app,
        path: projectPath(fakeObjectId),
        auth,
        body: { name: "Updated" },
      }).expect(404);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(404);
    });

    it("should return 404 for project belonging to another user", async () => {
      const authOwner = buildAuthContext();
      const authOther = buildAuthContext();
      const created = await createProject(app, authOwner, "Owner Project");

      const response = await authenticatedPatch({
        app,
        path: projectPath(created.id),
        auth: authOther,
        body: { name: "Hijacked" },
      }).expect(404);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/v1/projects/:projectId", () => {
    it("should return 401 when no auth provided", async () => {
      const response = await request(app.getHttpServer() as App)
        .delete(projectPath(fakeObjectId))
        .expect(401);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(401);
      expect(typeof errorBody.requestId).toBe("string");
    });

    it("should delete project and return confirmation", async () => {
      const auth = buildAuthContext();
      const created = await createProject(app, auth, "To Delete");

      const response = await authenticatedDelete({
        app,
        path: projectPath(created.id),
        auth,
      }).expect(200);
      const body = getDeleteBody(response);

      expect(body.deleted).toBe(true);
      expect(body.projectId).toBe(created.id);
    });

    it("should not return deleted project via GET", async () => {
      const auth = buildAuthContext();
      const created = await createProject(app, auth, "To Delete");

      await authenticatedDelete({
        app,
        path: projectPath(created.id),
        auth,
      }).expect(200);

      await authenticatedGet({
        app,
        path: projectPath(created.id),
        auth,
      }).expect(404);
    });

    it("should return 404 for nonexistent project", async () => {
      const auth = buildAuthContext();

      const response = await authenticatedDelete({
        app,
        path: projectPath(fakeObjectId),
        auth,
      }).expect(404);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(404);
    });

    it("should return 404 for project belonging to another user", async () => {
      const authOwner = buildAuthContext();
      const authOther = buildAuthContext();
      const created = await createProject(app, authOwner, "Owner Project");

      const response = await authenticatedDelete({
        app,
        path: projectPath(created.id),
        auth: authOther,
      }).expect(404);
      const errorBody = getErrorBody(response);

      expect(errorBody.statusCode).toBe(404);
    });
  });
});

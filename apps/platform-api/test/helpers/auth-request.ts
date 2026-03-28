import request, { type Test } from "supertest";
import { App } from "supertest/types";

import type { INestApplication } from "@nestjs/common";

export type TAuthContext = {
  userId: string;
  email: string;
};

const defaultAuthContext: TAuthContext = {
  userId: "e2e-user-1",
  email: "e2e-user-1@example.com",
};

export const applyLocalAuthBypassEnv = () => {
  process.env["ENV"] = "local";
  process.env["SKIP_AUTH_FOR_LOCAL_ENV"] = "true";
};

export const authenticatedGet = (input: {
  app: INestApplication;
  path: string;
  auth?: TAuthContext;
}): Test => {
  const auth = input.auth ?? defaultAuthContext;

  return request(input.app.getHttpServer() as App)
    .get(input.path)
    .set({
      "user-id": auth.userId,
      "user-email": auth.email,
    });
};

export const authenticatedPost = (input: {
  app: INestApplication;
  path: string;
  auth?: TAuthContext;
  body: Record<string, unknown>;
}): Test => {
  const auth = input.auth ?? defaultAuthContext;

  return request(input.app.getHttpServer() as App)
    .post(input.path)
    .set({
      "user-id": auth.userId,
      "user-email": auth.email,
    })
    .send(input.body);
};

export const authenticatedPatch = (input: {
  app: INestApplication;
  path: string;
  auth?: TAuthContext;
  body: Record<string, unknown>;
}): Test => {
  const auth = input.auth ?? defaultAuthContext;

  return request(input.app.getHttpServer() as App)
    .patch(input.path)
    .set({
      "user-id": auth.userId,
      "user-email": auth.email,
    })
    .send(input.body);
};

export const authenticatedDelete = (input: {
  app: INestApplication;
  path: string;
  auth?: TAuthContext;
  body?: Record<string, unknown>;
}): Test => {
  const auth = input.auth ?? defaultAuthContext;

  const req = request(input.app.getHttpServer() as App)
    .delete(input.path)
    .set({
      "user-id": auth.userId,
      "user-email": auth.email,
    });

  return input.body ? req.send(input.body) : req;
};

import type { AxiosInstance } from "axios";

import type {
  TCreateProjectRequest,
  TCreateProjectResponse,
  TDeleteProjectResponse,
  TGetProjectResponse,
  TListProjectsQuery,
  TListProjectsResponse,
  TUpdateProjectRequest,
  TUpdateProjectResponse,
} from "@repo/contracts";

import { httpClient } from "@/core/packages/http";
import { handleHttpError } from "@/core/packages/http/http-client.error";

const listProjects = async (params?: {
  query?: TListProjectsQuery;
  serverClient?: AxiosInstance;
}) => {
  const { query, serverClient } = params ?? {};
  const client = serverClient ?? httpClient;
  try {
    const res = await client.get<TListProjectsResponse>("/api/v1/projects", {
      params: query,
    });
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

const createProject = async (params: {
  body: TCreateProjectRequest;
  serverClient?: AxiosInstance;
}) => {
  const { body, serverClient } = params;
  const client = serverClient ?? httpClient;
  try {
    const res = await client.post<TCreateProjectResponse>(
      "/api/v1/projects",
      body,
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

const getProject = async (params: {
  projectId: string;
  serverClient?: AxiosInstance;
}) => {
  const { projectId, serverClient } = params;
  const client = serverClient ?? httpClient;
  try {
    const res = await client.get<TGetProjectResponse>(
      `/api/v1/projects/${projectId}`,
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

const updateProject = async (params: {
  projectId: string;
  body: TUpdateProjectRequest;
  serverClient?: AxiosInstance;
}) => {
  const { projectId, body, serverClient } = params;
  const client = serverClient ?? httpClient;
  try {
    const res = await client.patch<TUpdateProjectResponse>(
      `/api/v1/projects/${projectId}`,
      body,
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

const deleteProject = async (params: {
  projectId: string;
  serverClient?: AxiosInstance;
}) => {
  const { projectId, serverClient } = params;
  const client = serverClient ?? httpClient;
  try {
    const res = await client.delete<TDeleteProjectResponse>(
      `/api/v1/projects/${projectId}`,
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

export const projectsApi = {
  list: listProjects,
  create: createProject,
  get: getProject,
  update: updateProject,
  delete: deleteProject,
};

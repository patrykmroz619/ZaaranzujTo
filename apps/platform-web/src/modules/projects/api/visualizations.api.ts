import type { AxiosInstance } from "axios";

import type {
  TCreateVisualizationHeaders,
  TListProjectVisualizationsQuery,
  TListProjectVisualizationsResponse,
  TUpdateVisualizationRequest,
  TUpdateVisualizationResponse,
  TVisualizationDetails,
} from "@repo/contracts";

import { httpClient } from "@/core/packages/http";
import { handleHttpError } from "@/core/packages/http/http-client.error";

const listVisualizations = async (params: {
  projectId: string;
  query?: TListProjectVisualizationsQuery;
  serverClient?: AxiosInstance;
}) => {
  const { projectId, query, serverClient } = params;
  const client = serverClient ?? httpClient;
  try {
    const res = await client.get<TListProjectVisualizationsResponse>(
      `/api/v1/projects/${projectId}/visualizations`,
      { params: query },
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

const createVisualization = async (params: {
  projectId: string;
  body: FormData;
  headers: TCreateVisualizationHeaders;
  serverClient?: AxiosInstance;
}) => {
  const { projectId, body, headers, serverClient } = params;
  const client = serverClient ?? httpClient;
  try {
    const res = await client.post<TVisualizationDetails>(
      `/api/v1/projects/${projectId}/visualizations`,
      body,
      { headers: { ...headers, "Content-Type": undefined }, timeout: 0 },
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

const getVisualization = async (params: {
  visualizationId: string;
  serverClient?: AxiosInstance;
}) => {
  const { visualizationId, serverClient } = params;
  const client = serverClient ?? httpClient;
  try {
    const res = await client.get<TVisualizationDetails>(`/api/v1/visualizations/${visualizationId}`);
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

const updateVisualization = async (params: {
  visualizationId: string;
  body: TUpdateVisualizationRequest;
  serverClient?: AxiosInstance;
}) => {
  const { visualizationId, body, serverClient } = params;
  const client = serverClient ?? httpClient;
  try {
    const res = await client.patch<TUpdateVisualizationResponse>(
      `/api/v1/visualizations/${visualizationId}`,
      body,
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

export const visualizationsApi = {
  list: listVisualizations,
  create: createVisualization,
  get: getVisualization,
  update: updateVisualization,
};

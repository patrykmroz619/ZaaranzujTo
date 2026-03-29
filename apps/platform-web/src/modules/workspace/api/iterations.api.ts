import type { AxiosInstance } from "axios";

import type {
  TCreateIterationHeaders,
  TCreateIterationResponse,
  TListVisualizationIterationsQuery,
  TListVisualizationIterationsResponse,
} from "@repo/contracts";

import { httpClient } from "@/core/packages/http";
import { handleHttpError } from "@/core/packages/http/http-client.error";

const listIterations = async (params: {
  visualizationId: string;
  query?: TListVisualizationIterationsQuery;
  serverClient?: AxiosInstance;
}) => {
  const { visualizationId, query, serverClient } = params;
  const client = serverClient ?? httpClient;
  try {
    const res = await client.get<TListVisualizationIterationsResponse>(
      `/api/v1/visualizations/${visualizationId}/iterations`,
      { params: query },
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

const createIteration = async (params: {
  visualizationId: string;
  body: FormData;
  headers: TCreateIterationHeaders;
  serverClient?: AxiosInstance;
}) => {
  const { visualizationId, body, headers, serverClient } = params;
  const client = serverClient ?? httpClient;
  try {
    const res = await client.post<TCreateIterationResponse>(
      `/api/v1/visualizations/${visualizationId}/iterations`,
      body,
      { headers },
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

export const iterationsApi = {
  list: listIterations,
  create: createIteration,
};

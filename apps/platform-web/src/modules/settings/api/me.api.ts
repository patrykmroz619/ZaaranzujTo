import type { AxiosInstance } from "axios";

import type { TMeResponse, TUpdateMeRequest, TUpdateMeResponse } from "@repo/contracts";

import { httpClient } from "@/core/packages/http";
import { handleHttpError } from "@/core/packages/http/http-client.error";

const getMe = async (params?: { serverClient?: AxiosInstance }) => {
  const client = params?.serverClient ?? httpClient;
  try {
    const res = await client.get<TMeResponse>("/api/v1/me");
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

const updateMeProfile = async (params: {
  body: TUpdateMeRequest;
  serverClient?: AxiosInstance;
}) => {
  const { body, serverClient } = params;
  const client = serverClient ?? httpClient;
  try {
    const res = await client.patch<TUpdateMeResponse>("/api/v1/me", body);
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

export const meApi = {
  get: getMe,
  updateProfile: updateMeProfile,
};

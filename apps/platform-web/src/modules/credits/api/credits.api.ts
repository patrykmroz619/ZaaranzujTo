import type { AxiosInstance } from "axios";

import type { TCreditBalance, TGetCreditPackagesResponse } from "@repo/contracts";

import { httpClient } from "@/core/packages/http";
import { handleHttpError } from "@/core/packages/http/http-client.error";

const getCreditBalance = async (params?: { serverClient?: AxiosInstance }) => {
  const client = params?.serverClient ?? httpClient;
  try {
    const res = await client.get<TCreditBalance>("/api/v1/credits/balance");
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

const getCreditPackages = async (params?: {
  serverClient?: AxiosInstance;
}) => {
  const client = params?.serverClient ?? httpClient;
  try {
    const res = await client.get<TGetCreditPackagesResponse>(
      "/api/v1/credits/packages",
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

export const creditsApi = {
  getBalance: getCreditBalance,
  getPackages: getCreditPackages,
};

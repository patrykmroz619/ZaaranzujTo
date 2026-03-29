import type { TMeResponse } from "@repo/contracts";

import { httpClient } from "@/core/packages/http";
import { handleHttpError } from "@/core/packages/http/http-client.error";

export const getProfile = async (): Promise<TMeResponse> => {
  try {
    const res = await httpClient.get<TMeResponse>("/api/v1/me");
    return res.data;
  } catch (error) {
    return handleHttpError(error);
  }
};

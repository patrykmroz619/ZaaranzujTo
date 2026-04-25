import type { AxiosInstance } from "axios";

import type { TSignedUrlResponse } from "@repo/contracts";

import { httpClient } from "@/core/packages/http";
import { handleHttpError } from "@/core/packages/http/http-client.error";

const getDownloadUrl = async (params: { assetId: string; serverClient?: AxiosInstance }) => {
  const { assetId, serverClient } = params;
  const client = serverClient ?? httpClient;
  try {
    const res = await client.get<TSignedUrlResponse>(
      `/api/v1/storage/assets/${assetId}/download-url`,
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

const downloadAsset = async (params: { assetId: string }) => {
  const { assetId } = params;
  try {
    const res = await httpClient.get<Blob>(`/api/v1/storage/assets/${assetId}/download`, {
      responseType: "blob",
    });
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
};

export const storageApi = {
  getDownloadUrl,
  downloadAsset,
};

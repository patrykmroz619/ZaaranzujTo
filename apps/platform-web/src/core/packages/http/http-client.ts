import { getToken } from "@clerk/nextjs";
import axios from "axios";

import { BASE_HTTP_CONFIG } from "./http-client.config";

const httpClient = axios.create(BASE_HTTP_CONFIG);

httpClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retried) {
      originalRequest._retried = true;
      const freshToken = await getToken({ skipCache: true });
      if (freshToken) {
        originalRequest.headers.Authorization = `Bearer ${freshToken}`;
        return httpClient(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);

export { httpClient };

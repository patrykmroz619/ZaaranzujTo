import axios from "axios";

import { BASE_HTTP_CONFIG } from "./http-client.config";

const httpClient = axios.create(BASE_HTTP_CONFIG);

httpClient.interceptors.request.use(async (config) => {
  const clerk = (
    window as Window & { Clerk?: { session?: { getToken: () => Promise<string | null> } } }
  ).Clerk;
  const token = await clerk?.session?.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { httpClient };

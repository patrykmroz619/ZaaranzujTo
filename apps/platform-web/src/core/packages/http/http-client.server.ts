import axios from "axios";

import { BASE_HTTP_CONFIG } from "./http-client.config";

export const createServerHttpClient = (token: string) => {
  const instance = axios.create(BASE_HTTP_CONFIG);
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return instance;
};

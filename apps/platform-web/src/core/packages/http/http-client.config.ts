import type { CreateAxiosDefaults } from "axios";

export const BASE_HTTP_CONFIG: CreateAxiosDefaults = {
  baseURL: process.env.NEXT_PUBLIC_PLATFORM_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
};

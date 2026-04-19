import axios from "axios";

type TApiErrorDetails = Record<string, unknown>;

export class ApiError extends Error {
  statusCode: number;
  code?: string;
  details?: TApiErrorDetails;

  constructor(params: {
    message: string;
    statusCode: number;
    code?: string;
    details?: TApiErrorDetails;
  }) {
    const { message, statusCode, code, details } = params;
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const handleHttpError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new ApiError({
        message: error.response.data?.message ?? error.message,
        statusCode: error.response.status,
        code: error.response.data?.code,
        details: error.response.data?.details,
      });
    }
    throw new ApiError({ message: "Network error", statusCode: 0 });
  }
  throw error;
};

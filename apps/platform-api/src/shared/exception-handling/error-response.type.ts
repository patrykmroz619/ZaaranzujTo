export type TErrorResponse = {
  statusCode: number;
  message: string;
  requestId: string;
  details?: unknown;
};

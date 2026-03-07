import axios, {
  AxiosError,
  AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';

type TGetAuthToken = () => Promise<string | null>;

type TCreateHttpServiceParams = {
  getAuthToken?: TGetAuthToken;
};

type THttpRequestParams<TBody = unknown, TQuery = unknown> = {
  url: string;
  data?: TBody;
  params?: TQuery;
  config?: AxiosRequestConfig<TBody>;
};

export type THttpService = {
  get: <TResponse, TQuery = unknown>(
    params: THttpRequestParams<never, TQuery>,
  ) => Promise<TResponse>;
  post: <TResponse, TBody = unknown, TQuery = unknown>(
    params: THttpRequestParams<TBody, TQuery>,
  ) => Promise<TResponse>;
  put: <TResponse, TBody = unknown, TQuery = unknown>(
    params: THttpRequestParams<TBody, TQuery>,
  ) => Promise<TResponse>;
  patch: <TResponse, TBody = unknown, TQuery = unknown>(
    params: THttpRequestParams<TBody, TQuery>,
  ) => Promise<TResponse>;
  delete: <TResponse, TQuery = unknown>(
    params: THttpRequestParams<never, TQuery>,
  ) => Promise<TResponse>;
};

type TClerkWindow = Window & {
  Clerk?: {
    session?: {
      getToken: () => Promise<string | null>;
    };
  };
};

const getBaseUrl = () => {
  const baseUrl = process.env['NEXT_PUBLIC_PLATFORM_API_URL'];

  if (!baseUrl) {
    throw new Error('Missing API base URL. Set NEXT_PUBLIC_PLATFORM_API_URL.');
  }

  return baseUrl;
};

const isServer = () => {
  return typeof window === 'undefined';
};

const getServerToken = async () => {
  const authModule = await import('@clerk/nextjs/server');
  const clerkAuth = await authModule.auth();

  return await clerkAuth.getToken();
};

const getClientToken = async () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const clerkWindow = window as TClerkWindow;

  return await clerkWindow.Clerk?.session?.getToken();
};

const getDefaultAuthToken = async () => {
  if (isServer()) {
    return await getServerToken();
  }

  return await getClientToken();
};

const createAxiosInstance = (
  params: TCreateHttpServiceParams,
): AxiosInstance => {
  const { getAuthToken } = params;
  const authTokenProvider = getAuthToken ?? getDefaultAuthToken;

  const instance = axios.create({
    baseURL: getBaseUrl(),
    timeout: 15_000,
  });

  instance.interceptors.request.use(async (config) => {
    const token = await authTokenProvider();

    if (!token) {
      return config;
    }

    config.headers.set('Authorization', `Bearer ${token}`);

    return config;
  });

  return instance;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const messageFromApi = (error.response?.data as { message?: string })
      ?.message;

    if (messageFromApi) {
      return messageFromApi;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Request failed';
};

const request = async <TResponse, TBody = unknown, TQuery = unknown>(params: {
  instance: AxiosInstance;
  method: AxiosRequestConfig<TBody>['method'];
  requestParams: THttpRequestParams<TBody, TQuery>;
}): Promise<TResponse> => {
  const { instance, method, requestParams } = params;
  const { url, data, params: queryParams, config } = requestParams;

  try {
    const response = await instance.request<
      TResponse,
      { data: TResponse },
      TBody
    >({
      url,
      method,
      data,
      params: queryParams,
      ...config,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createHttpService = (
  params?: TCreateHttpServiceParams,
): THttpService => {
  const instance = createAxiosInstance(params ?? {});

  return {
    get: async <TResponse, TQuery = unknown>(
      requestParams: THttpRequestParams<never, TQuery>,
    ) => {
      return await request<TResponse, never, TQuery>({
        instance,
        method: 'GET',
        requestParams,
      });
    },
    post: async <TResponse, TBody = unknown, TQuery = unknown>(
      requestParams: THttpRequestParams<TBody, TQuery>,
    ) => {
      return await request<TResponse, TBody, TQuery>({
        instance,
        method: 'POST',
        requestParams,
      });
    },
    put: async <TResponse, TBody = unknown, TQuery = unknown>(
      requestParams: THttpRequestParams<TBody, TQuery>,
    ) => {
      return await request<TResponse, TBody, TQuery>({
        instance,
        method: 'PUT',
        requestParams,
      });
    },
    patch: async <TResponse, TBody = unknown, TQuery = unknown>(
      requestParams: THttpRequestParams<TBody, TQuery>,
    ) => {
      return await request<TResponse, TBody, TQuery>({
        instance,
        method: 'PATCH',
        requestParams,
      });
    },
    delete: async <TResponse, TQuery = unknown>(
      requestParams: THttpRequestParams<never, TQuery>,
    ) => {
      return await request<TResponse, never, TQuery>({
        instance,
        method: 'DELETE',
        requestParams,
      });
    },
  };
};

export const http = createHttpService();

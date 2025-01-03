import uuid from 'react-native-uuid';

import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

import {Storage} from '../storage';

const API_TIMEOUT = 40000;

interface ServerResponse<T> {
  message: string;
  meta: {requestId: string; nextCursor?: number};
  status: {
    code: string;
    message: string;
    errors: {field: string; message: string}[] | null;
  };
  payload: T;
  data?: T;
}

interface HttpClientResponse<T> {
  payload?: T;
  meta: {requestId: string; nextCursor?: number};
  // isSuccess means "Does the happy case success?"
  isSuccess: boolean;
  // HTTP / Axios
  serverMessage: string;
  serverStatusCode: number;
  // Business Logic from BE Service
  requestId: string;
  clientMessage: string;
  clientStatusCode: string;
  clientErrors: {field: string; message: string}[] | null;
}

export const createBaseHeader = async (headers: any = {}) => {
  const userAuth = Storage.retrieve('USER_AUTH');

  const clientAuth = {
    accessToken: 'accessToken',
  };

  const onboardAuth = {
    accessToken: 'accessToken',
  };
  const appRouteConfig = 'appRouteConfig';

  const result = {
    'GTW-Authorization': '',
    'OBD-Authorization': '',
    'X-Request-ID': '',
    'X-Open-ID': '',
    'X-Platform': '',
    'x-app-route-config': '',
    'x-session-id': '',
    'x-amz-request-id': '',
    'Cache-Control': 'no-store',
    ...headers,
  };

  if (userAuth && userAuth.accessToken) {
    result['GTW-Authorization'] = `Bearer ${userAuth.accessToken}`;
  } else if (clientAuth && clientAuth.accessToken) {
    result['GTW-Authorization'] = `Bearer ${clientAuth.accessToken}`;
  }

  if (userAuth && userAuth.sessionId) {
    result['x-session-id'] = userAuth.sessionId;
  }

  if (appRouteConfig) {
    result['x-app-route-config'] = appRouteConfig;
  }

  if (onboardAuth && onboardAuth.accessToken) {
    result['OBD-Authorization'] = `Bearer ${onboardAuth.accessToken}`;
  }

  result['X-Request-ID'] = uuid.v4().toString();

  return result;
};

const createAxios = async <T>(config: RequestConfig | undefined) => {
  const baseHeader = await createBaseHeader(config?.headers);
  const instance = axios.create({
    headers: baseHeader,
    timeout: API_TIMEOUT,
    baseURL: 'https://api-int.sit.galaxyfinx.cloud',
  });

  const validateCmsData = async () => {
    return true;
  };

  instance.interceptors.response.use(
    async function (response: AxiosResponse<ServerResponse<T>>) {
      let isSuccess = true;
      let payload = response.data.payload || response.data.data;

      const isVikkiCms = response.config.url?.includes('vikki-cms/api');
      if (isVikkiCms) {
        const isValidSignature = await validateCmsData(response.data);
        if (!isValidSignature) {
          isSuccess = false;
        }
      }
      return {
        isSuccess,
        payload: payload,
        meta: response.data.meta,
        //
        serverMessage: response.statusText,
        serverStatusCode: response.status,
        //
        requestId: response.data.meta.requestId,
        clientErrors: response.data.status?.errors || '',
        clientStatusCode: response.data.status?.code || '',
        clientMessage: response.data.status?.message || '',
      };
    },
    function (error: any) {
      console.log(error.response.status);
      //   try {
      //     let errorRes;
      //     if (error.response) {
      //       errorRes = error.response as AxiosResponse<ServerResponse<T>>;
      //     } else {
      //       errorRes = error as AxiosResponse<ServerResponse<T>>;
      //     }
      //     const isUnAuthorized =
      //       errorRes.status === HTTP_CODE.UNAUTHORIZED &&
      //       errorRes.data?.message?.toLowerCase() ===
      //         HTTP_MESSAGE.UNAUTHORIZED.toLowerCase();
      //     if (isUnAuthorized && !!config?.opt?.silentRequest === false) {
      //       store.dispatch(AppActions.restart());
      //     }
      //     if (
      //       errorRes?.data?.status?.code &&
      //       errorRes.data.status.code ===
      //         PAYMENT_RESPONSE_CODE.UNABLE_TO_CREATE_TRANSACTION_IN_OVERDRAFT_EOD_PERIOD
      //     ) {
      //       store.dispatch(
      //         AppActions.showTemporarilyInterruptedSheet({
      //           statusCode: errorRes.data.status.code,
      //         }),
      //       );
      //       return;
      //     }
      //     return {
      //       isSuccess: false,
      //       payload: errorRes.data?.payload,
      //       meta: errorRes.data?.meta,
      // //       //
      // //       serverMessage: errorRes.statusText,
      // //       serverStatusCode: errorRes.status,
      // //       //
      // //       requestId: errorRes.data?.meta?.requestId || '',
      // //       clientErrors: errorRes.data?.status?.errors || '',
      // //       clientStatusCode:
      // //         errorRes.data?.status?.code ||
      // //         `${errorRes?.code ? `network.${errorRes?.code}` : ''}`,
      // //       clientMessage:
      // //         errorRes.data?.status?.message || errorRes?.message || '',
      // //     };
      //   } catch (err) {}
    },
  );

  return instance;
};

type CustomRequestConfig = {
  silentRequest?: boolean;
};

type RequestConfig = AxiosRequestConfig & {opt?: CustomRequestConfig};

const Post = async <T = any>(
  route: string,
  data?: any,
  config?: RequestConfig,
) => {
  return (await createAxios(config)).post<any, HttpClientResponse<T>>(
    route,
    data,
    config,
  );
};

const Put = async <T = any>(
  route: string,
  data?: any,
  config?: RequestConfig,
) => {
  return (await createAxios(config)).put<any, HttpClientResponse<T>>(
    route,
    data,
    config,
  );
};

const Patch = async <T = any>(
  route: string,
  data?: any,
  config?: RequestConfig,
) => {
  return (await createAxios(config)).patch<any, HttpClientResponse<T>>(
    route,
    data,
    config,
  );
};

const Get = async <T = any>(
  route: string,
  params?: any,
  config: RequestConfig = {},
) => {
  return (await createAxios(config)).get<any, HttpClientResponse<T>>(route, {
    params,
    ...config,
  });
};

const Delete = async <T = any>(route: string, config: RequestConfig = {}) => {
  return (await createAxios(config)).delete<any, HttpClientResponse<T>>(route, {
    data: {},
    ...config,
  });
};

const HttpClient = {Post, Get, Put, Patch, Delete, createBaseHeader};

export {HttpClient};
export type {HttpClientResponse};

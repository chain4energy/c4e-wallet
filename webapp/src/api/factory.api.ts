import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders} from 'axios';
import {applyAuthTokenInterceptor, getBrowserSessionStorage, IAuthTokens, TokenRefreshRequest} from "axios-jwt";
import {useConfigurationStore} from "@/store/configuration.store";
import {applyStorage} from "axios-jwt/dist/src/applyStorage";
import {EvServiceApi} from "@/api/evService.api";
import {IAuthTokenInterceptorConfig} from "axios-jwt/src/IAuthTokenInterceptorConfig";

let testfileName = '';

class ApiFactory {

  private static instance: ApiFactory;

  private _axios: AxiosInstance;
  private _axiosJwt: AxiosInstance;

  private readonly _evServiceApi = new EvServiceApi(() => this._axiosJwt);

  private testMode = false;

  // https://www.npmjs.com/package/axios-jwt

  private constructor() {
    this._axios = axios.create({});
    this._axiosJwt = axios.create({});
    applyAuthTokenInterceptor(this._axiosJwt, this.authTokenInterceptorConfig);
    applyStorage(getBrowserSessionStorage());
  }

  requestRefresh: TokenRefreshRequest = async (refreshToken: string) => {
    return axios.post(this.getRefreshTokenUrl(), { refreshToken })
      .then(response => response.data.access_token);
  };

  private authTokenInterceptorConfig: IAuthTokenInterceptorConfig = {
    requestRefresh: this.requestRefresh,
    header: "Authorization",
    headerPrefix: "Bearer "
  };

  private getRefreshTokenUrl() {
    return useConfigurationStore().config.evServiceURL + useConfigurationStore().config.queriesEv.REFRESH_TOKEN;
  }
  public static getInstance(): ApiFactory {
    if (!ApiFactory.instance) {
      ApiFactory.instance = new ApiFactory();
    }
    return ApiFactory.instance;
  }

  public evServiceApi(): EvServiceApi {
    return this._evServiceApi;
  }

  public setAxiosInstance(axios: AxiosInstance) {
    this._axios = axios;
  }
  public setAxiosJWTInstance(axios: AxiosInstance) {
    this._axiosJwt = axios;
  }

  public runTestMode(testConfigFileName: string) {
    this.testMode = true;
    testfileName = testConfigFileName;
    this._axios.request = testModeAxios;

  }

  public runNormalMode() {
    if (this.testMode) {
      this._axios = axios.create({});
      this.testMode = false;
    }
  }

}

export default ApiFactory.getInstance();

async function testModeAxios<T = any, R = AxiosResponse<T, any>, D = any>(config: AxiosRequestConfig<D>): Promise<R> {
  // eslint-disable-next-line
  const actions = require("../test_mode/" + testfileName);
  if (!config) {
    throw new Error('No config');
  }
  if (!config.url) {
    throw new Error('No config.url');
  }

  let url = config.url;

  if (config.params) {
    const key = config.params['pagination.key'];
    const limit = config.params['pagination.limit'];
    const reverse = config.params['pagination.reverse'];

    const params = [];
    if (key) {
      params.push(['pagination.key', key]);
    }
    if (limit) {
      params.push(['pagination.limit', limit]);
    }
    if (reverse) {
      params.push(['pagination.reverse', reverse]);
    }


    if (params.length > 0) {
      url += '?';
      for (let i = 0; i < params.length; i++) {
        url += params[i][0] + '=' + params[i][1];
        if (i < params.length - 1) {
          url += '&';
        }
      }
    }
  }

  const action = actions[url];
  if (!action) {
    throw new Error('Action not found for URL: ' + url);
  }
  if (!action.status) {
    throw new Error('No action.status');
  }
  if (!action.data) {
    throw new Error('No action.data');
  }
  return {
    data: action.data,
    status: action.status,
    statusText: 'string',
    headers: undefined as unknown as AxiosResponseHeaders,
    config: config,
    request: undefined
  } as unknown as R;

}

// const skipPropertiesList = new Set([
//   'constructor',
//   '__defineGetter__',
//   '__defineSetter__',
//   'hasOwnProperty',
//   '__lookupGetter__',
//   '__lookupSetter__',
//   'isPrototypeOf',
//   'propertyIsEnumerable',
//   'toString',
//   'valueOf',
//   '__proto__',
//   'toLocaleString',
// ]);

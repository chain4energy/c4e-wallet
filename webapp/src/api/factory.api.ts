import {ValidatorsApi} from "@/api/validators.api";
import {TokensApi} from "@/api/tokensApi";
import {BlockApi} from "@/api/block.api";
import {ProposalsApi} from "@/api/proposals.api";
import {AccountApi} from "@/api/account.api";
import WalletConnectionApi from "./wallet.connecton.api";
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders} from 'axios';
import { KeybaseApi } from "./keybase.api";
import {AirDropApi} from "@/api/airDrop.api";
import {applyAuthTokenInterceptor, getBrowserLocalStorage, IAuthTokens, TokenRefreshRequest} from "axios-jwt";
import { useConfigurationStore } from "@/store/configuration.store";
import queries from "@/api/queries";
import {FaucetApi} from "@/api/faucet.api";
import {PublicSaleServiceApi} from "@/api/publicSaleService.api";

let testfileName = '';

class ApiFactory {

  private static instance: ApiFactory;

  private _axios: AxiosInstance;
  private _axiosJwt: AxiosInstance;

  private readonly _validatorsApi = new ValidatorsApi(() => this._axios);
  private readonly _tokensApi = new TokensApi(() => this._axios);
  private readonly _blockApi = new BlockApi(() => this._axios);
  private readonly _proposalsApi = new ProposalsApi(() => this._axios);
  private readonly _accountApi = new AccountApi(() => this._axios);
  private readonly _walletApi = new WalletConnectionApi();
  private readonly _keybaseApi = new KeybaseApi(() => this._axios);
  private readonly _airDropApi = new AirDropApi(() => this._axios);
  private readonly _publicSaleServiceApi = new PublicSaleServiceApi(() => this._axiosJwt);
  private readonly _faucetApi = new FaucetApi(() => this._axios)

  private testMode = false;

  // https://www.npmjs.com/package/axios-jwt
  requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<IAuthTokens | string> => {

    // Important! Do NOT use the axios instance that you supplied to applyAuthTokenInterceptor (in our case 'axiosInstance')
    // because this will result in an infinite loop when trying to refresh the token.
    // Use the global axios client or a different instance
    const response = await axios.post(useConfigurationStore().config.publicSaleServiceURL + queries.publicSaleService.REFRESH_TOKEN,  null,{headers: {Authorization: 'Bearer ' + refreshToken}});

    // If your backend supports rotating refresh tokens, you may also choose to return an object containing both tokens:
    // return {
    //  accessToken: response.data.access_token,
    //  refreshToken: response.data.refresh_token
    //}
    return { accessToken:response.data.access_token.token, refreshToken:response.data.refresh_token.token };
  }

  private constructor() {
    this._axios = axios.create({});
    this._axiosJwt = axios.create({});
    applyAuthTokenInterceptor(this._axiosJwt, {requestRefresh: this.requestRefresh });
  }

  public static getInstance(): ApiFactory {
    if (!ApiFactory.instance) {
      ApiFactory.instance = new ApiFactory();
    }
    return ApiFactory.instance;
  }

  public validatorsApi(): ValidatorsApi{
    return this._validatorsApi;
  }
  public tokensApi(): TokensApi{
    return this._tokensApi;
  }
  public blockApi(): BlockApi {
    return this._blockApi;
  }
  public proposalsApi(): ProposalsApi {
    return this._proposalsApi;
  }
  public accountApi(): AccountApi{
    return this._accountApi;
  }
  public walletApi(): WalletConnectionApi{
    return this._walletApi;
  }
  public keybaseApi(): KeybaseApi{
    return this._keybaseApi;
  }
  public airDropApi(): AirDropApi{
    return this._airDropApi;
  }
  public publicSaleServiceApi(): PublicSaleServiceApi {
    return this._publicSaleServiceApi;
  }
  public setAxiosInstance(axios: AxiosInstance) {
    this._axios = axios;
  }
  public faucetApi(): FaucetApi {
    return this._faucetApi;
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
      for(let i = 0; i < params.length; i++) {
        url += params[i][0] + '=' + params[i][1] ;
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

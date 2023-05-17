import {ValidatorsApi} from "@/api/validators.api";
import {TokensApi} from "@/api/tokensApi";
import {BlockApi} from "@/api/block.api";
import {ProposalsApi} from "@/api/proposals.api";
import {AccountApi} from "@/api/account.api";
import WalletConnectionApi from "./wallet.connecton.api";
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders} from 'axios';
import { KeybaseApi } from "./keybase.api";
import {AirDropApi} from "@/api/airDrop.api";
import {FaucetApi} from "@/api/faucet.api";

let testfileName = '';

class ApiFactory {

  private static instance: ApiFactory;

  private _axios: AxiosInstance;

  private readonly _validatorsApi = new ValidatorsApi(() => this._axios);
  private readonly _tokensApi = new TokensApi(() => this._axios);
  private readonly _blockApi = new BlockApi(() => this._axios);
  private readonly _proposalsApi = new ProposalsApi(() => this._axios);
  private readonly _accountApi = new AccountApi(() => this._axios);
  private readonly _walletApi = new WalletConnectionApi();
  private readonly _keybaseApi = new KeybaseApi(() => this._axios);
  private readonly _airDropApi = new AirDropApi(() => this._axios);
  private readonly _faucetApi = new FaucetApi(() => this._axios)
  private testMode = false;

  private constructor() {
    this._axios = axios.create({});
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
  public setAxiosInstance(axios: AxiosInstance) {
    this._axios = axios;
  }
  public faucetApi(): FaucetApi {
    return this._faucetApi;
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

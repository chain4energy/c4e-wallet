import {ValidatorsApi} from "@/api/validators.api";
import {TokensApi} from "@/api/tokensApi";
import {BlockApi} from "@/api/block.api";
import {ProposalsApi} from "@/api/proposals.api";
import {AccountApi} from "@/api/account.api";
import WalletConnectionApi from "./wallet.connecton.api";
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders} from 'axios';

let testfileName = '';

class ApiFactory {

  private static instance: ApiFactory;

  private _axios: AxiosInstance;

  private readonly _validatorsApi = new ValidatorsApi(() => this._axios);
  private readonly _tokensApi = new TokensApi(() => this._axios);
  private readonly _blockApi = new BlockApi(() => this._axios);
  private readonly _proposalsApi = new ProposalsApi(() => this._axios);
  private readonly _accountApi = new AccountApi(() => this._axios)
  private readonly _walletApi = new WalletConnectionApi()
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
  public setAxiosInstance(axios: AxiosInstance) {
    this._axios = axios;
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
    throw new Error('No config.url');
  }
  if (!config.url) {
    throw new Error('No config.url');
  }
  // const modifiedUrl = config.url.replaceAll("/", "_");
  const action = actions[config.url];
  if (!action) {
    throw new Error('Action not found for URL: ' + config.url);
  }
  if (!action.status) {
    throw new Error('No action.status');
  }
  if (!action.data) {
    throw new Error('No action.data');
  }
  console.log('HURRAAAAAAAAAAAAAA');
  return {
    data: action.data,
    status: action.status,
    statusText: 'string',
    headers: undefined as unknown as AxiosResponseHeaders,
    config: config,
    request: undefined
  } as unknown as R;
  
}


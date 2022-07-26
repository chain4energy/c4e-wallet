import {ValidatorsApi} from "@/api/validators.api";
import {TokensApi} from "@/api/tokensApi";
import {BlockApi} from "@/api/block.api";
import {ProposalsApi} from "@/api/proposals.api";
import {AccountApi} from "@/api/account.api";
import WalletConnectionApi from "./wallet.connecton.api";
import axios, {AxiosInstance} from 'axios';

class ApiFactory {

  private static instance: ApiFactory;

  private _axios: AxiosInstance;

  private readonly _validatorsApi = new ValidatorsApi(() => this._axios);
  private readonly _tokensApi = new TokensApi(() => this._axios);
  private readonly _blockApi = new BlockApi(() => this._axios);
  private readonly _proposalsApi = new ProposalsApi(() => this._axios);
  private readonly _accountApi = new AccountApi(() => this._axios)
  private readonly _walletApi = new WalletConnectionApi()

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
}

export default ApiFactory.getInstance();


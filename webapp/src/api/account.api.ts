import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import BaseApi from "@/api/base.api";
import { RequestResponse } from "@/models/request-response";
import { Account, balances } from "@/models/account";

export class AccountApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.ACCOUNT_SERVICE;
  }

  //TODO: MS: move to global configuration service
  private ACCOUNT_URL = "https://lcd.chain4energy.org/cosmos/auth/v1beta1/accounts/";
  private BALANCE_URL = 'https://lcd.chain4energy.org/cosmos/bank/v1beta1/balances/';
  private STACKED_AMOUNT_URL = 'https://lcd.chain4energy.org/cosmos/staking/v1beta1/delegations/'
  private UNSTACKED_AMOUNT_URL = 'https://lcd.chain4energy.org/cosmos/staking/v1beta1/delegators/'
  private REWARDS_URL = 'https://lcd.chain4energy.org//cosmos/distribution/v1beta1/delegators/';

  public async fetchAccount(id: string): Promise<RequestResponse<Account>> {
    return this.axiosCall({
      method: 'GET',
      url: this.ACCOUNT_URL + id
    }, true, null);
  }
  public async fetchBalances(id: string): Promise<RequestResponse<balances>>{
    return this.axiosCall({
      method: 'GET',
      url: this.BALANCE_URL + id
    }, true, null)
  }
  public async fetchStackedTokens(id: string): Promise<RequestResponse<any>>{
    return this.axiosCall({
      method: 'GET',
      url: this.STACKED_AMOUNT_URL + id
    }, true, null)
  }
  public async fetchUnstackedTokens(id: string): Promise<RequestResponse<any>>{
    return this.axiosCall({
      method: 'GET',
      url: this.UNSTACKED_AMOUNT_URL + id + '/unbonding_delegations'
    }, true, null)
  }
  public async fetchRewards(id: string): Promise<RequestResponse<any>>{
    return this.axiosCall({
      method: 'GET',
      url: this.REWARDS_URL + id + '/rewards'
    }, true, null)
  }
}

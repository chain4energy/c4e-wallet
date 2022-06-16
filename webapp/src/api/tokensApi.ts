import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import BaseApi from "@/api/base.api";
import { StakingPool} from "@/models/StakingPool";
import {TotalSupply} from "@/models/TotalSupply";
import {AirdropPool, CommunityPool, StrategicReversePool} from "@/models/Pools";

export class TokensApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.TOKENS_SERVICE;
  }

  //TODO: MS: move to global configuration service
  private STAKING_POOL_URL = 'https://lcd.chain4energy.org/cosmos/staking/v1beta1/pool';
  private TOTAL_SUPPLY_URL = 'https://lcd.chain4energy.org/cosmos/bank/v1beta1/supply/uc4e';
  private COMMUNITY_POOL_URL =  'https://lcd.chain4energy.org/cosmos/distribution/v1beta1/community_pool';
  private STRATEGIC_RESERVE_POOL_URL = 'https://lcd.chain4energy.org/cosmos/bank/v1beta1/balances/c4e1hcfjejmxzl8d95xka5j8cjegmf32u2lee3q422/by_denom?denom=uc4e';
  private AIRDROP_POOL_URL = 'https://lcd.chain4energy.org/cosmos/bank/v1beta1/balances/c4e1dutmadwfernuzmzk8ndtfah254yhrnv34y68ts/by_denom?denom=uc4e';

  public async fetchStakingPool(): Promise<RequestResponse<StakingPool>> {
    return this.axiosCall({
      method: 'GET',
      url: this.STAKING_POOL_URL
    }, true, null);
  }

  public async fetchTotalSupply(): Promise<RequestResponse<TotalSupply>> {
    return this.axiosCall({
      method: 'GET',
      url: this.TOTAL_SUPPLY_URL
    }, true, null);
  }

  public async fetchCommunityPool(): Promise<RequestResponse<CommunityPool>> {
    return this.axiosCall({
      method: 'GET',
      url: this.COMMUNITY_POOL_URL
    }, true, null);
  }

  public async fetchStrategicReversePool(): Promise<RequestResponse<StrategicReversePool>> {
    return this.axiosCall({
      method: 'GET',
      url: this.STRATEGIC_RESERVE_POOL_URL
    }, true, null);
  }

  public async fetchAirdropPool(): Promise<RequestResponse<AirdropPool>> {
    return this.axiosCall({
      method: 'GET',
      url: this.AIRDROP_POOL_URL
    }, true, null);
  }
}

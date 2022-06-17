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

  private STAKING_POOL_URL = process.env.VUE_APP_STAKING_POOL_URL;
  private TOTAL_SUPPLY_URL = process.env.VUE_APP_TOTAL_SUPPLY_URL;
  private COMMUNITY_POOL_URL =  process.env.VUE_APP_COMMUNITY_POOL_URL;
  private STRATEGIC_RESERVE_POOL_URL = process.env.VUE_APP_STRATEGIC_RESERVE_POOL_URL;
  private AIRDROP_POOL_URL = process.env.VUE_APP_AIRDROP_POOL_URL;

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

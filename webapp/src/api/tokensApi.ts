import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import BaseApi from "@/api/base.api";
import { StakingPool} from "@/models/StakingPool";
import {TotalSupply} from "@/models/TotalSupply";
import {AirdropPool, CommunityPool, StrategicReversePool} from "@/models/Pools";
import {useConfigurationStore} from "@/store/configuration.store";
import { ErrorData, BlockchainApiErrorData } from "@/api/base.api";

export class TokensApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.TOKENS_SERVICE;
  }

  private STAKING_POOL_URL = process.env.VUE_APP_STAKING_POOL_URL;
  private TOTAL_SUPPLY_URL = process.env.VUE_APP_TOTAL_SUPPLY_URL;
  private COMMUNITY_POOL_URL =  process.env.VUE_APP_COMMUNITY_POOL_URL;
  private STRATEGIC_RESERVE_POOL_URL = process.env.VUE_APP_STRATEGIC_RESERVE_POOL_URL;
  private AIRDROP_POOL_URL = process.env.VUE_APP_AIRDROP_POOL_URL;

  public async fetchStakingPool(): Promise<RequestResponse<StakingPool, ErrorData<BlockchainApiErrorData>>> {
    return this.axiosBlockchainApiCall({
      method: 'GET',
      url: useConfigurationStore().config.bcApiURL+this.STAKING_POOL_URL
    }, true, null);
  }

  public async fetchTotalSupply(): Promise<RequestResponse<TotalSupply, ErrorData<BlockchainApiErrorData>>> {
    return this.axiosBlockchainApiCall({
      method: 'GET',
      url: useConfigurationStore().config.bcApiURL+this.TOTAL_SUPPLY_URL
    }, true, null);
  }

  public async fetchCommunityPool(): Promise<RequestResponse<CommunityPool, ErrorData<BlockchainApiErrorData>>> {
    return this.axiosBlockchainApiCall({
      method: 'GET',
      url: useConfigurationStore().config.bcApiURL+this.COMMUNITY_POOL_URL
    }, true, null);
  }

  public async fetchStrategicReversePool(): Promise<RequestResponse<StrategicReversePool, ErrorData<BlockchainApiErrorData>>> {
    return this.axiosBlockchainApiCall({
      method: 'GET',
      url: useConfigurationStore().config.bcApiURL+this.STRATEGIC_RESERVE_POOL_URL
    }, true, null);
  }

  public async fetchAirdropPool(): Promise<RequestResponse<AirdropPool, ErrorData<BlockchainApiErrorData>>> {
    return this.axiosBlockchainApiCall({
      method: 'GET',
      url: useConfigurationStore().config.bcApiURL+this.AIRDROP_POOL_URL
    }, true, null);
  }
}

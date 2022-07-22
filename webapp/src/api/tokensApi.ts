import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import BaseApi from "@/api/base.api";
import {useConfigurationStore} from "@/store/configuration.store";
import { ErrorData, BlockchainApiErrorData } from "@/api/base.api";
import { StakingPool } from "@/models/store/tokens";
import { CommunityPoolResponse, StakingPoolResponse } from "@/models/blockchain/tokens";
import { mapStakingPool } from "@/models/mapper/tokens.mapper";
import { Coin, DecCoin } from "@/models/store/common";
import { SupplyResponse } from "@/models/blockchain/tokens";
import { findByDenomAndMapDecCoin, mapCoin } from "@/models/mapper/common.mapper";

export class TokensApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.TOKENS_API;
  }

  private STAKING_POOL_URL = process.env.VUE_APP_STAKING_POOL_URL;
  private TOTAL_SUPPLY_URL = process.env.VUE_APP_TOTAL_SUPPLY_URL;
  private COMMUNITY_POOL_URL =  process.env.VUE_APP_COMMUNITY_POOL_URL;

  public async fetchStakingPool(): Promise<RequestResponse<StakingPool, ErrorData<BlockchainApiErrorData>>>{
    const mapData = (bcData: StakingPoolResponse | undefined) => { return mapStakingPool(bcData?.pool); };
    return  await this.axiosGetBlockchainApiCall(useConfigurationStore().config.bcApiURL+this.STAKING_POOL_URL,
      mapData, true, null, 'fetchStakingPool - ');
  }

  public async fetchTotalSupply(denom: string): Promise<RequestResponse<Coin, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: SupplyResponse | undefined) => {return mapCoin(bcData?.amount, denom);};
    return  await this.axiosGetBlockchainApiCall(useConfigurationStore().config.bcApiURL+this.TOTAL_SUPPLY_URL + '/' + denom,
      mapData, true, null, 'fetchTotalSupply - ');
  }

  public async fetchCommunityPoolByDenom(denom: string): Promise<RequestResponse<DecCoin, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: CommunityPoolResponse | undefined) => {return findByDenomAndMapDecCoin(bcData?.pool, denom);};
    return  await this.axiosGetBlockchainApiCall(useConfigurationStore().config.bcApiURL+this.COMMUNITY_POOL_URL,
      mapData, true, null, 'fetchCommunityPoolByDenom - ');
  }

}

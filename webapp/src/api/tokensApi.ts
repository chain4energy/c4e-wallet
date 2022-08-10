import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import BaseApi from "@/api/base.api";
import {useConfigurationStore} from "@/store/configuration.store";
import { ErrorData } from "@/api/base.api";
import { StakingPool } from "@/models/store/tokens";
import { CommunityPoolResponse, InflationResponse, StakingPoolResponse } from "@/models/blockchain/tokens";
import { mapStakingPool } from "@/models/mapper/tokens.mapper";
import { Coin, DecCoin } from "@/models/store/common";
import { SupplyResponse } from "@/models/blockchain/tokens";
import { findByDenomAndMapDecCoin, mapCoin } from "@/models/mapper/common.mapper";
import queries from "./queries";
import { formatString } from "@/utils/string-formatter";
import { BlockchainApiErrorData } from "@/models/blockchain/common";

export class TokensApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.TOKENS_API;
  }

  private STAKING_POOL_URL = queries.blockchain.STAKING_POOL_URL;
  private TOTAL_SUPPLY_URL = queries.blockchain.TOTAL_SUPPLY_URL;
  private COMMUNITY_POOL_URL = queries.blockchain.COMMUNITY_POOL_URL;

  public async fetchStakingPool(lockscreen: boolean): Promise<RequestResponse<StakingPool, ErrorData<BlockchainApiErrorData>>>{
    const mapData = (bcData: StakingPoolResponse | undefined) => { return mapStakingPool(bcData?.pool); };
    return  await this.axiosGetBlockchainApiCall(this.STAKING_POOL_URL,
      mapData, lockscreen, null, 'fetchStakingPool - ');
  }

  public async fetchTotalSupply(denom: string, lockscreen: boolean): Promise<RequestResponse<Coin, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: SupplyResponse | undefined) => {return mapCoin(bcData?.amount, denom);};
    return  await this.axiosGetBlockchainApiCall(formatString(this.TOTAL_SUPPLY_URL, {denom: denom}),
      mapData, lockscreen, null, 'fetchTotalSupply - ');
  }

  public async fetchInflation(lockscreen: boolean): Promise<RequestResponse<number, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (inflation: InflationResponse | undefined) => {
      if (!inflation || !inflation.inflation) {
        return Number.NaN;
      }
      return Number(inflation.inflation);
    };
    return  await this.axiosGetBlockchainApiCall(queries.blockchain.INFLATION_URL,
      mapData, lockscreen, null, 'fetchInflation - ', undefined, undefined, true); // TODO remove skip toast when inflation on testnet
  }

  public async fetchCommunityPoolByDenom(denom: string, lockscreen: boolean): Promise<RequestResponse<DecCoin, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: CommunityPoolResponse | undefined) => {return findByDenomAndMapDecCoin(bcData?.pool, denom);};
    return  await this.axiosGetBlockchainApiCall(this.COMMUNITY_POOL_URL,
      mapData, lockscreen, null, 'fetchCommunityPoolByDenom - ');
  }

}

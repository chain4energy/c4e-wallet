import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import BaseApi, {ErrorData} from "@/api/base.api";
import {StakingPool} from "@/models/store/tokens";
import {
  CommunityPoolResponse,
  InflationResponse,
  StakingPoolResponse,
  SupplyResponse
} from "@/models/blockchain/tokens";
import {mapStakingPool} from "@/models/mapper/tokens.mapper";
import {Coin, DecCoin} from "@/models/store/common";
import {findByDenomAndMapDecCoin, mapCoin} from "@/models/mapper/common.mapper";
import queries from "./queries";
import {formatString} from "@/utils/string-formatter";
import {BlockchainApiErrorData} from "@/models/blockchain/common";
import { Vestings } from "@/models/blockchain/c4e.vesting";
import {DistributorParamsResponse} from "@/models/blockchain/distributorParams";
import {mapDistributorParameters} from "@/models/mapper/distributor.parameters.mapper";
import {useConfigurationStore} from "@/store/configuration.store";

export class TokensApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.TOKENS_API;
  }
  public async fetchStakingPool(lockscreen: boolean): Promise<RequestResponse<StakingPool, ErrorData<BlockchainApiErrorData>>>{
    const mapData = (bcData: StakingPoolResponse | undefined) => { return mapStakingPool(bcData?.pool); };
    return  await this.axiosGetBlockchainApiCall(useConfigurationStore().config.queries.STAKING_POOL_URL,
      mapData, lockscreen, null, 'fetchStakingPool - ');
  }

  public async fetchTotalSupply(denom: string, lockscreen: boolean): Promise<RequestResponse<Coin, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: SupplyResponse | undefined) => {return mapCoin(bcData?.amount, denom);};
    return  await this.axiosGetBlockchainApiCall(formatString(useConfigurationStore().config.queries.TOTAL_SUPPLY_URL, {denom: denom}),
      mapData, lockscreen, null, 'fetchTotalSupply - ');
  }

  public async fetchInflation(lockscreen: boolean): Promise<RequestResponse<number, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (inflation: InflationResponse | undefined) => {
      if (!inflation || !inflation.inflation) {
        return Number.NaN;
      }
      return Number(inflation.inflation);
    };
    return  await this.axiosGetBlockchainApiCall(useConfigurationStore().config.queries.INFLATION_URL,
      mapData, lockscreen, null, 'fetchInflation - ', undefined, undefined);
  }

  public async fetchCommunityPoolByDenom(denom: string, lockscreen: boolean): Promise<RequestResponse<DecCoin, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: CommunityPoolResponse | undefined) => {return findByDenomAndMapDecCoin(bcData?.pool, denom);};
    return  await this.axiosGetBlockchainApiCall(useConfigurationStore().config.queries.COMMUNITY_POOL_URL,
      mapData, lockscreen, null, 'fetchCommunityPoolByDenom - ');
  }

  public async fetchVestingLockedNotDelegated(lockscreen: boolean): Promise<RequestResponse<bigint, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: Vestings | undefined) => {
      if (bcData && bcData.vesting_all_amount && bcData.delegated_vesting_amount) {
        return BigInt(bcData.vesting_all_amount) - BigInt(bcData.delegated_vesting_amount);
      }
      return 0n;
    };
    return  await this.axiosGetBlockchainApiCall(useConfigurationStore().config.queries.VESTINGS_SUM_URL,
      mapData, lockscreen, null, 'fetchVestingLockedNotDelegated - ');
  }
  public async fetchShareParameter(lockscreen: boolean): Promise<RequestResponse<number, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: DistributorParamsResponse | undefined) => {return mapDistributorParameters(bcData?.params);};
    return  await this.axiosGetBlockchainApiCall(useConfigurationStore().config.queries.DISTRIBUTOR_PARAMS_URL,
      mapData, lockscreen, null, 'fetchDistributorParams - ');
  }
}

import {RequestResponse} from "@/models/request-response";
import {Params} from "@/models/store/params";
import BaseApi, {ErrorData} from "@/api/base.api";
import {BlockchainApiErrorData} from "@/models/blockchain/common";
import {StakingParamsResponse} from "@/models/blockchain/stakingParams";
import {mapParameter} from "@/models/mapper/params.mapper";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {StakingPoolResponse} from "@/models/blockchain/tokens";
import {mapStakingPool} from "@/models/mapper/tokens.mapper";
import {sortAndRankValidators} from "@/models/mapper/validator.mapper";

export class AirDropApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.AIR_DROP_STORE;
  }

}

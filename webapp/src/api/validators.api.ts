import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import BaseApi from "@/api/base.api";
import {ErrorData} from "@/api/base.api";
import {ValidatorsResponse} from "@/models/blockchain/validator";
import {Validator} from "@/models/store/validator";
import {mapAndAddValidators, mapValidatorDescription, mapValidators, sortAndRankValidators} from "@/models/mapper/validator.mapper";
import queries from "./queries";
import { BlockchainApiErrorData } from "@/models/blockchain/common";
import { StakingParamsResponse } from "@/models/blockchain/stakingParams";
import { mapParameter } from "@/models/mapper/params.mapper";
import { Params } from "@/models/store/params";
import {HasuraErrorData} from "@/models/hasura/error";
import {ValidatorDescriptionResponse} from "@/models/hasura/validatorDescriptionResponse";

export class ValidatorsApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.VALIDATORS_API;
  }

  private VALIDATORS_URL = queries.blockchain.VALIDATORS_URL;
  private STACKING_PARAMS_URL = queries.blockchain.STAKING_PARAMS_URL

  public async fetchAllValidators(lockscreen: boolean): Promise<RequestResponse<{ validators: Validator[], numberOfActive: number }, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: ValidatorsResponse | undefined) => {
      return mapValidators(bcData?.validators);
    };
    const mapAndAddData = (data: { validators: Validator[], numberOfActive: number }, bcData: ValidatorsResponse | undefined) => {
      return mapAndAddValidators(data.validators, bcData?.validators, data.numberOfActive);
    };

    const result = await this.axiosGetAllBlockchainApiCallPaginated(this.VALIDATORS_URL,
      mapData, mapAndAddData, lockscreen, null, 'fetchAllValidators - ');
    if (result.data !== undefined) {
      result.data.validators = sortAndRankValidators(result.data.validators);
    }
    return result;
  }

  public async fetchStakingParams(lockscreen: boolean): Promise<RequestResponse<Params, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (params: StakingParamsResponse | undefined) => {
      return mapParameter(params?.params);
    };

    const result = await this.axiosGetBlockchainApiCall(this.STACKING_PARAMS_URL,
      mapData, lockscreen, null, 'fetchParameters -');
    return result;
  }

  public async fetchValidatorsLogo(lockscreen: boolean): Promise<RequestResponse<Map<string, string>, ErrorData<HasuraErrorData>>> {
    const mapData = (hasuraData: ValidatorDescriptionResponse | undefined) => {
      return mapValidatorDescription(hasuraData);
    };
    return this.axiosHasuraCall(queries.hasura.VALIDATOR_DESCRIPTION, mapData, lockscreen, null, 'fetchValidatorsLogo - ');
  }
}

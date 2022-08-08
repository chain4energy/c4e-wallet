import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import BaseApi from "@/api/base.api";
import {useConfigurationStore} from "@/store/configuration.store";
import { ErrorData } from "@/api/base.api";
import { ValidatorsResponse } from "@/models/blockchain/validator";
import { Validator } from "@/models/store/validator";
import { mapAndAddValidators, mapValidators, sortAndRankValidators } from "@/models/mapper/validator.mapper";
import queries from "./queries";
import { BlockchainApiErrorData } from "@/models/blockchain/common";

export class ValidatorsApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.VALIDATORS_API;
  }

  private VALIDATORS_URL = queries.blockchain.VALIDATORS_URL;

  public async fetchAllValidators(lockscreen: boolean): Promise<RequestResponse<{ validators: Validator[], numberOfActive: number}, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: ValidatorsResponse | undefined) => {return mapValidators(bcData?.validators);};
    const mapAndAddData = (data: { validators: Validator[], numberOfActive: number}, bcData: ValidatorsResponse | undefined) => {return mapAndAddValidators(data.validators, bcData?.validators, data.numberOfActive);};

    const result = await this.axiosGetAllBlockchainApiCallPaginated(this.VALIDATORS_URL,
            mapData, mapAndAddData, lockscreen, null, 'fetchAllValidators - ');
    if (result.data !== undefined) {
      result.data.validators = sortAndRankValidators(result.data.validators);
    }
    return result;
  }

}

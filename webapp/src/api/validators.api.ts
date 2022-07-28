import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import BaseApi from "@/api/base.api";
import {useConfigurationStore} from "@/store/configuration.store";
import { ErrorData, BlockchainApiErrorData } from "@/api/base.api";
import { ValidatorsResponse } from "@/models/blockchain/validator";
import { Validator } from "@/models/store/validator";
import { mapAndAddValidators, mapValidators, sortAndRankValidators } from "@/models/mapper/validator.mapper";

export class ValidatorsApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.VALIDATORS_API;
  }

  // public async fetchActiveValidatorCount(): Promise<RequestResponse<ActiveValidatorCount, ErrorData<any>>> {
  //   return this.axiosHasuraCall({
  //     method: 'POST',
  //     url: useConfigurationStore().config.hasuraURL,
  //     data: {
  //       query: "query ActiveValidatorCount {\n" +
  //         "  activeTotal: validator_status_aggregate(where: {status: {_eq: 3}}) {\n" +
  //         "    aggregate {\n" +
  //         "      count\n" +
  //         "    }\n" +
  //         "  }\n" +
  //         "}",
  //     }
  //   }, true, null);
  // }

  private VALIDATORS_URL = process.env.VUE_APP_VALIDATORS_URL;

  public async fetchAllValidators(lockscreen: boolean): Promise<RequestResponse<{ validators: Validator[], numberOfActive: number}, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: ValidatorsResponse | undefined) => {return mapValidators(bcData?.validators);};
    const mapAndAddData = (data: { validators: Validator[], numberOfActive: number}, bcData: ValidatorsResponse | undefined) => {return mapAndAddValidators(data.validators, bcData?.validators, data.numberOfActive);};

    const result = await this.axiosGetAllBlockchainApiCallPaginated(useConfigurationStore().config.bcApiURL+this.VALIDATORS_URL,
            mapData, mapAndAddData, lockscreen, null, 'fetchAllValidators - ');
    if (result.data !== undefined) {
      result.data.validators = sortAndRankValidators(result.data.validators);
    }
    return result;
  }

}

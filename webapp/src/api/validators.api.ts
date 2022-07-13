import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import {ActiveValidatorCount} from "@/models/ActiveValidatorCount";
import BaseApi from "@/api/base.api";
import {Validators} from "@/models/validators";
import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";
import {useConfigurationStore} from "@/store/configuration.store";
import { Account } from "@/models/account";
import { ErrorData, BlockchainApiErrorData } from "@/api/base.api";
import { ValidatorsResponse } from "@/models/blockchain/validator";
import { Validator } from "@/models/store/validator";
import { mapValidators } from "@/models/mapper/validator.mapper";

export class ValidatorsApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.ACTIVE_VALIDATORS_SERVICE;
  }

  public async fetchActiveValidatorCount(): Promise<RequestResponse<ActiveValidatorCount, ErrorData<any>>> {
    return this.axiosHasuraCall({
      method: 'POST',
      url: useConfigurationStore().config.hasuraURL,
      data: {
        query: "query ActiveValidatorCount {\n" +
          "  activeTotal: validator_status_aggregate(where: {status: {_eq: 3}}) {\n" +
          "    aggregate {\n" +
          "      count\n" +
          "    }\n" +
          "  }\n" +
          "}",
      }
    }, true, null);
  }

  private VALIDATORS_URL = process.env.VUE_APP_VALIDATORS_URL;

  public async fetchAllValidators(pagination: PagingModel | null, lockScreen: boolean, localSpinner: LocalSpinner | null): Promise<RequestResponse<Validator[], ErrorData<BlockchainApiErrorData>>> {
    const result: RequestResponse<ValidatorsResponse, ErrorData<BlockchainApiErrorData>> = await this.axiosBlockchainApiCall({
      method: 'GET',
      url: useConfigurationStore().config.bcApiURL+this.VALIDATORS_URL,
      params: pagination?.toAxiosParams()
    }, lockScreen, localSpinner); // TODO fetch all with paging
    if (result.isError()) {
      return new RequestResponse<Validator[], ErrorData<BlockchainApiErrorData>>(result.error);
    }
    const validators = mapValidators(result.data?.validators);
    return new RequestResponse<Validator[], ErrorData<BlockchainApiErrorData>>(undefined, validators);
  }

  // public async fetchAllValidators(pagination: PagingModel | null, lockScreen: boolean, localSpinner: LocalSpinner | null): Promise<RequestResponse<Validators, ErrorData<BlockchainApiErrorData>>> {
  //   return this.axiosBlockchainApiCall({
  //     method: 'GET',
  //     url: useConfigurationStore().config.bcApiURL+this.VALIDATORS_URL,
  //     params: pagination?.toAxiosParams()
  //   }, lockScreen, localSpinner); // TODO fetch all with paging
  // }
  public async fetchValidatorUser(id: string, acc: StringConstructor): Promise<RequestResponse<Account, ErrorData<BlockchainApiErrorData>>>{
    return this.axiosBlockchainApiCall({
      method: "GET",
      url: this.VALIDATORS_URL+ "/"+ id + "/delegations/" + acc
    }, true, null, true);
  }

}

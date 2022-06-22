import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import {ActiveValidatorCount} from "@/models/ActiveValidatorCount";
import BaseApi from "@/api/base.api";
import {Validators} from "@/models/validators";
import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";
import {useConfigurationStore} from "@/store/configuration.store";

export class ValidatorsApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.ACTIVE_VALIDATORS_SERVICE;
  }

  public async fetchActiveValidatorCount(): Promise<RequestResponse<ActiveValidatorCount>> {
    return this.axiosCall({
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

  public async fetchAllValidators(pagination: PagingModel | null, lockScreen: boolean, localSpinner: LocalSpinner | null): Promise<RequestResponse<Validators>> {
    return this.axiosCall({
      method: 'GET',
      url: useConfigurationStore().config.bcApiURL+this.VALIDATORS_URL,
      params: pagination?.toAxiosParams()
    }, lockScreen, localSpinner);
  }

}

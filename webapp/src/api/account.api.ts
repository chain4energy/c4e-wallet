import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import {ActiveValidatorCount} from "@/models/ActiveValidatorCount";
import BaseApi from "@/api/base.api";
import {Validators} from "@/models/validators";
import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";

export class AccountApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.ACTIVE_VALIDATORS_SERVICE;
  }

  //TODO: MS: move to global configuration service
  private ACTIVE_VALIDATORS_URL = 'https://hasura-testnet.chain4energy.org/v1/graphql';

  public async fetchActiveValidatorCount(): Promise<RequestResponse<ActiveValidatorCount>> {
    return this.axiosCall({
      method: 'POST',
      url: this.ACTIVE_VALIDATORS_URL,
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

  private VALIDATORS_URL = 'https://lcd.chain4energy.org/cosmos/staking/v1beta1/validators';

  public async fetchAllValidators(pagination: PagingModel | null, lockScreen: boolean, localSpinner: LocalSpinner | null): Promise<RequestResponse<Validators>> {
    return this.axiosCall({
      method: 'GET',
      url: this.VALIDATORS_URL,
      params: pagination?.toAxiosParams()
    }, lockScreen, localSpinner);
  }

}

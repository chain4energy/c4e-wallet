import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import BaseApi from "@/api/base.api";
import { RequestResponse } from "@/models/request-response";
import { Account } from "@/models/account";

export class AccountApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.ACCOUNT_SERVICE;
  }

  //TODO: MS: move to global configuration service
  private ACCOUNT_URL = `https://lcd.chain4energy.org/cosmos/auth/v1beta1/accounts`;

  public async fetchAccount(id: string): Promise<RequestResponse<{account: Account}>> {
    return this.axiosCall({
      method: 'GET',
      url: this.ACCOUNT_URL +"/"+id
    }, true, null);
  }
}

import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import BaseApi from "@/api/base.api";
import {Pool} from "@/models/tokenomics";

export class TokenomicsApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.TOKENOMICS_SERVICE;
  }

  //TODO: MS: move to global configuration service
  private TOKENOMICS_URL = 'https://lcd.chain4energy.org/cosmos/staking/v1beta1/pool';

  public async fetchTokenomics(): Promise<RequestResponse<Pool>> {
    return this.axiosCall({
      method: 'GET',
      url: this.TOKENOMICS_URL
    }, true, null);
  }


}

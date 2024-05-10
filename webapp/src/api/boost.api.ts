import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";


export class BoostApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.BOOST_API;
  }

  // public fetchBoostConfig(): Promise<RequestResponse<FaucetResponse, ErrorData<FaucetResponse>>> {
  public fetchBoostConfig(){
    return;
    // const url = formatString(useConfigurationStore().config.faucetURL ,{address: accountAddress});
    // return this.axiosCall({
    //   method: 'GET',
    //   url: url,
    //   headers: {
    //     'recaptcha-response': recaptchaToken
    //   }
    // }, true, null, 'topUpAccount');
  }

  public fetchUserBoosts(){
    return;
  }
}

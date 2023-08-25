import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import {formatString} from "@/utils/string-formatter";
import {useConfigurationStore} from "@/store/configuration.store";
import {FaucetResponse} from "@/models/faucet";


export class FaucetApi extends BaseApi {
    getServiceType(): ServiceTypeEnum {
        return ServiceTypeEnum.FAUCET_API;
    }

    public topUpAccount(accountAddress:string, recaptchaToken: string): Promise<RequestResponse<FaucetResponse, ErrorData<FaucetResponse>>> {
        const url = formatString(useConfigurationStore().config.faucetURL ,{address: accountAddress});
        return this.axiosCall({
            method: 'GET',
            url: url,
          headers: {
              'recaptcha-response': recaptchaToken
          }
        }, true, null, 'topUpAccount');
    }
}

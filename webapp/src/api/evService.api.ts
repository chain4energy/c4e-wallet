import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useConfigurationStore} from "@/store/configuration.store";
import {RequestResponse} from "@/models/request-response";
import {formatString} from "@/utils/string-formatter";
import {Jwt} from "@/models/user/jwt";
import {SaleServiceApplicationError} from "@/models/saleServiceCommons";
import queries from "@/api/queries";
import {EvServiceApplicationError, LinkDecoderDto, LoginAuthRequest} from "@/models/ev/evServiceCommons";
import {WalletAuthRequest} from "@/models/user/walletAuth";


export class EvServiceApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.EV_SERVICE_API;
  }

  private evServicePostCall<R, T, E>(evServiceUrlPart: string, data: R, lockscreen: boolean, logPrefix: string): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'POST',
        url: useConfigurationStore().config.evServiceURL + evServiceUrlPart,
        data: data
      },
      lockscreen,
      null,
      logPrefix
    );
  }

  private evServiceGetCall<T, E>(evServiceUrlPart: string, lockscreen: boolean, logPrefix: string): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'GET',
        url: useConfigurationStore().config.evServiceURL + evServiceUrlPart
      },
      lockscreen,
      null,
      logPrefix
    );
  }

  // public evLoginEmail(){
  //   const url = formatString(useConfigurationStore().config.queries ,{address: accountAddress});
  // }

  public evLoginEmailAndLoginData(authRequest: LoginAuthRequest, lockscreen: boolean){
      return this.evServicePostCall<LoginAuthRequest, Jwt, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.LOGIN_EMAIL_AND_LOGIN_DATA, authRequest, lockscreen, "activateEmailAccount");
  }

  public evDecodeLink(path:string, lockscreen: boolean){
    return this.evServiceGetCall<LinkDecoderDto, EvServiceApplicationError>(path, lockscreen, "evDecodeLink");
  }

}

import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useConfigurationStore} from "@/store/configuration.store";
import {RequestResponse} from "@/models/request-response";
import {Jwt} from "@/models/user/jwt";
import {
  DecodeLinkAuthParams,
  EvServiceApplicationError,
  LinkDecoderDto,
  LoginAuthRequest,
  QrCodeInfoParams,
  StartChargingAnonumousRequest,
  StartChargingAnonumousResponse
} from "@/models/ev/evServiceCommons";
import {ChargePointInfo} from "@/models/ev/chargerInfo";
import {SessionInfo} from "@/models/ev/sessionInfo";


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

  public evLoginWithResource(authRequest: LoginAuthRequest, lockscreen: boolean) {
    return this.evServicePostCall<LoginAuthRequest, Jwt, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.LOGIN_WITH_RESOURCE, authRequest, lockscreen, "activateEmailAccount");
  }

  public evDecodeLink(path: string, lockscreen: boolean) {
    return this.evServiceGetCall<LinkDecoderDto<DecodeLinkAuthParams>, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + "/v0.1/link/" + path, lockscreen, "evDecodeLink");
  }

  public evQrCodeInfo(path: string, lockscreen: boolean) {
    return this.evServiceGetCall<LinkDecoderDto<QrCodeInfoParams>, EvServiceApplicationError>(path, lockscreen, "evQrCodeInfo");
  }

  public evChargePointInfo(path: string, lockscreen: boolean) {
    return this.evServiceGetCall<ChargePointInfo, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + path, lockscreen, "evChargePointInfo");
  }

  public startCharging(path: string, login: string, lockscreen: boolean) {
    return this.evServicePostCall<StartChargingAnonumousRequest, StartChargingAnonumousResponse, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + path + "/session/prepareAnonymous", {login}, lockscreen, "evChargePointInfo");
  }

  public evFetchSesisonInfo(path: string, login: string, lockscreen: boolean) {
    return this.evServiceGetCall<SessionInfo, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + path, lockscreen, "evFetchSesisonInfo");
  }
}

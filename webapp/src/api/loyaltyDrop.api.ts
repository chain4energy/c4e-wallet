import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useConfigurationStore} from "@/store/configuration.store";
import {RequestResponse} from "@/models/request-response";
import {LocalSpinner} from "@/services/model/localSpinner";
import {LoyaltyDropPoolConfig} from "@/models/store/loyaltyDrop";
import {LoyaltyDropPoolConfigResponse, LoyaltyDropUserBoostResponse} from "@/models/loyaltydrop/loyaltyDrop";
import {mapLoyaltyDropConfig, mapLoyaltyDropUserBoost, mapLoyaltyDropUserBoostArray} from "@/models/mapper/loyaltydrop.mapper";
import {formatString} from "@/utils/string-formatter";

//TODO: get information from Dawid how error response will look like

export interface ServiceApplicationError /* extends BaseServiceApplicationError */{
  service: ServiceApplicationErrorService,
  code: number,
  name: string,
  codespace: ServiceApplicationErrorCodespace,
  message: string,
  iid: string,
  ts: Date,
  cause: ServiceApplicationError,
  data?: any
}

export enum ServiceApplicationErrorService {
  LOYALTY_DROP_SERVICE = 'loyalty-drop-service'
}

export enum ServiceApplicationErrorCodespace {
  API = 'api',
  AUTH = 'auth',
  NOTIFIER = 'notifier',
  PAYMENT_GW = 'payment-gw',
  PERSISTENCE = 'persistence',
  BASE_PERSISTENCE = 'base_persistence',
  SERVICE = 'service',
  SIGNATURE = 'signature'
}

// export interface LoyaltyDropServiceApplicationError /* extends BaseServiceApplicationError */{
//   service: LoyaltyDropServiceApplicationErrorService,
//   code: number,
//   name: string,
//   codespace: EvServiceApplicationErrorCodespace,
//   message: string,
//   iid: string,
//   ts: Date,
//   cause: EvServiceApplicationError,
//   data?: any
// }

export enum LoyaltyDropServiceApplicationErrorService {
  LOGIN_SERVICE = 'login-service',
  CENTRAL_SYSTEM_SERVICE = 'central-system-service'
}
export class LoyaltyDropApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.LOYALTY_DROP_API;
  }

  messages = {
    errorResponseName: 'Loyaltydrop data Error',
    errorResponseMassage: 'Loyaltydrop data error received',
    errorResponseToast: 'Loyaltydrop data Error: ',
    mappingErrorMassage: 'Loyaltydrop data mapping error: ',
  };

  private isResponseError<H>(response: RequestResponse<H, ErrorData<ServiceApplicationError>>) {
    return response.error != undefined;
  }

  private errorDataToInfo(data: ServiceApplicationError){
    return data.message;
  }

  private async axiosLoyaltyDropGetCall<T, H>(
    url: string,
    mapData: (data: H | undefined) => T,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix: string
  ): Promise<RequestResponse<T, ErrorData<ServiceApplicationError>>> {
    const config = {
      method: 'GET',
      url: url,
    };

    return this.axiosWith200ErrorCall<T, H, ServiceApplicationError>(
      config,
      mapData,
      lockScreen,
      localSpinner,
      logPrefix,
      this.isResponseError,
      this.messages,
      this.errorDataToInfo
    );
  }

  protected async axiosLoyaltyDropPostCall<R, T, H>(
    data: R,
    url: string,
    mapData: (data: H | undefined) => T,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix: string
  ): Promise<RequestResponse<T, ErrorData<ServiceApplicationError>>>
  {
    const config = {
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    };

    return this.axiosWith200ErrorCall<T, H, ServiceApplicationError>(
      config,
      mapData,
      lockScreen,
      localSpinner,
      logPrefix,
      this.isResponseError,
      this.messages,
      this.errorDataToInfo
    );
  }

  public fetchLoyaltyDropPoolsConfig(lockScreen: boolean): Promise<RequestResponse<LoyaltyDropPoolConfig[], ErrorData<ServiceApplicationError>>>{
    const url = useConfigurationStore().config.loyaltyDropService.loyaltyDropBaseUrl + useConfigurationStore().config.loyaltyDropService.loyaltyDropPoolConfigurationsUrl;
    const mapData = (data: LoyaltyDropPoolConfigResponse[] | undefined) => { return mapLoyaltyDropConfig(data); };
    return this.axiosLoyaltyDropGetCall(url, mapData, lockScreen, null, 'fetchLoyaltyDropPoolsConfig');
  }

  public fetchLoyaltyDropUserBoosts(accountAddress: string, lockScreen: boolean){
    const urlTemp = useConfigurationStore().config.loyaltyDropService.loyaltyDropBaseUrl + useConfigurationStore().config.loyaltyDropService.loyaltyDropUserBootsURL;
    const url = formatString(urlTemp, {user_address: accountAddress});
    const mapData = (data: LoyaltyDropUserBoostResponse[] | undefined) => { return mapLoyaltyDropUserBoostArray(data); };
    return this.axiosLoyaltyDropGetCall(url, mapData, lockScreen, null, 'fetchLoyaltyDropUserBoosts');
  }

  public broadcastSignedMassageToLoyaltyDropService(data:string, lockScreen: boolean){
    const url = useConfigurationStore().config.loyaltyDropService.loyaltyDropBaseUrl + useConfigurationStore().config.loyaltyDropService.loyaltyDropBroadcastURL;
    const mapData = (data: LoyaltyDropUserBoostResponse | undefined) => { return mapLoyaltyDropUserBoost(data); };

    return this.axiosLoyaltyDropPostCall(data, url, mapData, lockScreen, null, 'broadcastSignedMassageToLoyaltyDropService');
  }
  }

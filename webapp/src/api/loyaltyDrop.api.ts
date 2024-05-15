import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useConfigurationStore} from "@/store/configuration.store";
import {RequestResponse} from "@/models/request-response";
import {LocalSpinner} from "@/services/model/localSpinner";
import {LoyaltyDropPoolConfig} from "@/models/store/loyaltyDrop";
import {LoyaltyDropPoolConfigResponse, LoyaltyDropUserBoostResponse} from "@/models/loyaltydrop/loyaltyDrop";
import {mapLoyaltyDropConfig, mapLoyaltyDropUserBoost} from "@/models/mapper/loyaltydrop.mapper";
import {formatString} from "@/utils/string-formatter";
import queries from "@/api/queries";

export interface LoyaltyDropErrData {
  code: number;
  message: string;
  details?: string;

}
export class LoyaltyDropApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.LOYALTY_DROP_API;
  }

  protected async axiosBootGetCall<T, H>(
    localUrl: string,
    mapData: (data: H | undefined) => T,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix: string
  ): Promise<RequestResponse<T, ErrorData<LoyaltyDropErrData>>> {
    const config = {
      method: 'GET',
      url: localUrl,
    };

    const errorDataToInfo = (data: LoyaltyDropErrData) => {
      return data.message;
    };

    const isResponseError = (response: RequestResponse<H, ErrorData<LoyaltyDropErrData>>) => {
      return response.error != undefined;
    };

    const messages = {
      errorResponseName: 'Loyaltydrop data Error',
      errorResponseMassage: 'Loyaltydrop data error received',
      errorResponseToast: 'Loyaltydrop data Error: ',
      mappingErrorMassage: 'Loyaltydrop data mapping error: ',
    };

    return this.axiosWith200ErrorCall<T, H, LoyaltyDropErrData>(
      config,
      mapData,
      lockScreen,
      localSpinner,
      logPrefix,
      isResponseError,
      messages,
      errorDataToInfo
    );
  }

  public fetchLoyaltyDropPoolsConfig(lockScreen: boolean): Promise<RequestResponse<LoyaltyDropPoolConfig[], ErrorData<LoyaltyDropErrData>>>{
    const url = useConfigurationStore().config.loyaltyDropService.LOYALTY_DROP_BASE_URL + useConfigurationStore().config.loyaltyDropService.LOYALTY_DROP_POOL_CONFIGURATIONS_URL;
    const mapData = (data: LoyaltyDropPoolConfigResponse[] | undefined) => { return mapLoyaltyDropConfig(data); };
    return this.axiosBootGetCall(url, mapData, lockScreen, null, 'fetchBoostConfig');
  }

  public fetchLoyaltyDropUserBoosts(accountAddress: string, lockScreen: boolean){
    const urlTemp = useConfigurationStore().config.loyaltyDropService.LOYALTY_DROP_BASE_URL + useConfigurationStore().config.loyaltyDropService.loyaltyDropUserBootsURL;
    const url = formatString(urlTemp, {user_address: accountAddress});
    const mapData = (data: LoyaltyDropUserBoostResponse[] | undefined) => { return mapLoyaltyDropUserBoost(data); };
    return this.axiosBootGetCall(url, mapData, lockScreen, null, 'fetchBoostConfig');
  }
}

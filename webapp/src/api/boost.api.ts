import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {formatString} from "@/utils/string-formatter";
import {useConfigurationStore} from "@/store/configuration.store";
import {RequestResponse} from "@/models/request-response";
import {FaucetResponse} from "@/models/faucet";
import {BoostConfigResponse} from "@/models/boost/boost";
import {LocalSpinner} from "@/services/model/localSpinner";
import {AirdropErrData} from "@/models/blockchain/common";
import {BlockResponse} from "@/models/blockchain/block";
import {mapBlock} from "@/models/mapper/block.mapper";
import {mapBoostConfig} from "@/models/mapper/boost.mapper";
import {BoostConfig} from "@/models/store/boostConfig";

export interface BoostErrData {
  code: number;
  message: string;
  details?: string;

}
export class BoostApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.BOOST_API;
  }

  protected async axiosBootGetCall<T, H>(
    localUrl: string,
    mapData: (data: H | undefined) => T,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix: string
  ): Promise<RequestResponse<T, ErrorData<BoostErrData>>> {
    const config = {
      method: 'GET',
      url: localUrl,
    };

    const errorDataToInfo = (data: BoostErrData) => {
      return data.message;
    };

    const isResponseError = (response: RequestResponse<H, ErrorData<BoostErrData>>) => {
      return response.error != undefined;
    };

    const messages = {
      errorResponseName: 'Boost data Error',
      errorResponseMassage: 'Boost data error received',
      errorResponseToast: 'Boost data Error: ',
      mappingErrorMassage: 'Boost data mapping error: ',
    };

    return this.axiosWith200ErrorCall<T, H, BoostErrData>(
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

  public fetchBoostConfig(lockScreen: boolean): Promise<RequestResponse<BoostConfig[], ErrorData<BoostErrData>>>{
    const url = useConfigurationStore().config.loyaltyDropService.LOYALTY_DROP_BASE_URL + useConfigurationStore().config.loyaltyDropService.LOYALTY_DROP_POOL_CONFIGURATIONS_URL;
    const mapData = (data: BoostConfigResponse[] | undefined) => { return mapBoostConfig(data); };
    return this.axiosBootGetCall(url, mapData, lockScreen, null, 'fetchBoostConfig');
  }

  public fetchUserBoosts(){
    return;
  }
}

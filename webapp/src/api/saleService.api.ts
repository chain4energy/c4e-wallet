import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useConfigurationStore} from "@/store/configuration.store";
import {RequestResponse} from "@/models/request-response";
import {UserServiceErrData} from "@/models/user/userServiceCommons";
import queries from "@/api/queries";
import {
  InitPaymentSessionRequest,
  InitPaymentSessionResponse,
  ReserveTokensRequest,
  ReserveTokensResponse
} from "@/models/saleServiceCommons";


export class SaleServiceApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.SALE_SERVICE_API;
  }

  private saleServicePostCall<R, T, E>(saleServiceUrlPart: string, data: R, lockscreen: boolean): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'POST',
        url: useConfigurationStore().config.saleServiceURL + saleServiceUrlPart,
        data: data
      },
      lockscreen,
      null,
      true,
      'saleServicePostCall - '
    );
  }

  public async reserveTokens(amount: number, lockscreen: boolean): Promise<RequestResponse<ReserveTokensResponse, ErrorData<UserServiceErrData>>> {
    return this.saleServicePostCall<ReserveTokensRequest, ReserveTokensResponse, UserServiceErrData>(queries.saleService.RESERVE_TOKENS, {amount: amount}, lockscreen);
  }

  public async initPaymentSession(initPaymentSessionRequest: InitPaymentSessionRequest, lockscreen: boolean): Promise<RequestResponse<InitPaymentSessionResponse, ErrorData<UserServiceErrData>>> {
    return this.saleServicePostCall<InitPaymentSessionRequest, InitPaymentSessionResponse, UserServiceErrData>(queries.saleService.INIT_PAYMENT_SESSION, initPaymentSessionRequest, lockscreen);
  }

}

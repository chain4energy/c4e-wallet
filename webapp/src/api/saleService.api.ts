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
  ReserveTokensResponse, TokenReservationResponse
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

  private saleServiceGetCall<T, E>(saleServiceUrlPart: string, lockscreen: boolean): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'GET',
        url: useConfigurationStore().config.saleServiceURL + saleServiceUrlPart
      },
      lockscreen,
      null,
      true,
      'saleServiceGetCall - '
    );
  }

  public async reserveTokens(amount: number, lockscreen: boolean): Promise<RequestResponse<ReserveTokensResponse, ErrorData<UserServiceErrData>>> {
    return this.saleServicePostCall<ReserveTokensRequest, ReserveTokensResponse, UserServiceErrData>(queries.saleService.RESERVE_TOKENS, {amount: amount}, lockscreen);
  }

  public async initPaymentSession(initPaymentSessionRequest: InitPaymentSessionRequest, lockscreen: boolean): Promise<RequestResponse<InitPaymentSessionResponse, ErrorData<UserServiceErrData>>> {
    return this.saleServicePostCall<InitPaymentSessionRequest, InitPaymentSessionResponse, UserServiceErrData>(queries.saleService.INIT_PAYMENT_SESSION, initPaymentSessionRequest, lockscreen);
  }

  public async fetchReservationList(lockscreen: boolean): Promise<RequestResponse<TokenReservationResponse[], ErrorData<UserServiceErrData>>> {
    return this.saleServiceGetCall<TokenReservationResponse[], UserServiceErrData>(queries.saleService.TOKEN_RESERVATION_LIST, lockscreen);
  }

}

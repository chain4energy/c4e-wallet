import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {CreateAccountRequest, PasswordAuthenticateRequest} from "@/models/user/passwordAuth";
import {useConfigurationStore} from "@/store/configuration.store";
import {RequestResponse} from "@/models/request-response";
import {AirdropErrData, BlockchainApiErrorData} from "@/models/blockchain/common";
import {AccountInfo} from "@/models/user/accountInfo";
import {UserServiceErrData} from "@/models/user/userServiceCommons";
import queries from "@/api/queries";
import {CampaignsInfo} from "@/models/airdrop/airdrop";
import {Jwt} from "@/models/user/jwt";
import {
  InitWalletAuthRequest,
  InitWalletAuthResponse,
  WalletAuthRequest
} from "@/models/user/walletAuth";
import {EmailPairingRequest} from "@/models/user/emailPairing";
import {formatString} from "@/utils/string-formatter";
import {
  InitPaymentSessionRequest,
  InitPaymentSessionResponse,
  ReserveTokensRequest,
  ReserveTokensResponse, TokenReservationResponse
} from "@/models/saleServiceCommons";

export class PublicSaleServiceApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.PUBLIC_SALE_SERVICE_API;
  }

  private publicSaleServicePostCall<R, T, E>(userServiceUrlPart: string, data: R, lockscreen: boolean): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'POST',
        url: useConfigurationStore().config.publicSaleServiceURL + userServiceUrlPart,
        data: data
      },
      lockscreen,
      null,
      true,
      'createEmailAccount - '
    );
  }

  private publicSaleServiceGetCall<T, E>(userServiceUrlPart: string, lockscreen: boolean): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'GET',
        url: useConfigurationStore().config.publicSaleServiceURL + userServiceUrlPart
      },
      lockscreen,
      null,
      true,
      'createEmailAccount - '
    );
  }

  public async createEmailAccount(createAccountRequest: CreateAccountRequest, lockscreen: boolean): Promise<RequestResponse<AccountInfo, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<PasswordAuthenticateRequest, AccountInfo, UserServiceErrData>(queries.publicSaleService.EMAIL_CREATE_ACCOUNT, createAccountRequest, lockscreen);
  }

  public async authEmailAccount(emailAccount: PasswordAuthenticateRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<PasswordAuthenticateRequest, Jwt, UserServiceErrData>(queries.publicSaleService.AUTHENTICATE_EMAIL, emailAccount, lockscreen);
  }

  public async authWalletInit(initWalletAuth: InitWalletAuthRequest, lockscreen: boolean): Promise<RequestResponse<InitWalletAuthResponse, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<InitWalletAuthRequest, InitWalletAuthResponse, UserServiceErrData>(queries.publicSaleService.INIT_WALLET_AUTH, initWalletAuth, lockscreen);
  }
  public async authWalletKeplr(walletAuth: WalletAuthRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<WalletAuthRequest, Jwt, UserServiceErrData>(queries.publicSaleService.AUTHENTICATE_KEPLR, walletAuth, lockscreen);
  }
  public async authWalletMetamask(walletAuth: WalletAuthRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<WalletAuthRequest, Jwt, UserServiceErrData>(queries.publicSaleService.AUTHENTICATE_METAMASK, walletAuth, lockscreen);
  }

  public async activateEmailAccount(code: string, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServiceGetCall<Jwt, UserServiceErrData>(formatString(queries.publicSaleService.ACTIVATE_ACCOUNT, {activationCode: code}), lockscreen);
  }
  public pairEmail(emailPairing: EmailPairingRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>>{
    return this.publicSaleServicePostCall<EmailPairingRequest, Jwt, UserServiceErrData>(queries.publicSaleService.PAIR_EMAIL, emailPairing, lockscreen);
  }

  public async reserveTokens(amount: number, lockscreen: boolean): Promise<RequestResponse<ReserveTokensResponse, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<ReserveTokensRequest, ReserveTokensResponse, UserServiceErrData>(queries.publicSaleService.RESERVE_TOKENS, {amount: amount}, lockscreen);
  }

  public async initPaymentSession(initPaymentSessionRequest: InitPaymentSessionRequest, lockscreen: boolean): Promise<RequestResponse<InitPaymentSessionResponse, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<InitPaymentSessionRequest, InitPaymentSessionResponse, UserServiceErrData>(queries.publicSaleService.INIT_PAYMENT_SESSION, initPaymentSessionRequest, lockscreen);
  }

  public async fetchReservationList(lockscreen: boolean): Promise<RequestResponse<TokenReservationResponse[], ErrorData<UserServiceErrData>>> {
    return this.publicSaleServiceGetCall<TokenReservationResponse[], UserServiceErrData>(queries.publicSaleService.TOKEN_RESERVATION_LIST, lockscreen);
  }
}

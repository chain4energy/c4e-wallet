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
import {formatString} from "@/utils/string-formatter";

export class UserServiceApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.USER_SERVICE_API;
  }

  private userServicePostCall<R, T, E>(userServiceUrlPart: string, data: R, lockscreen: boolean): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'POST',
        url: useConfigurationStore().config.userServiceURL + userServiceUrlPart,
        data: data
      },
      lockscreen,
      null,
      true,
      'createEmailAccount - '
    );
  }

  private userServiceGetCall<R, T, E>(userServiceUrlPart: string, lockscreen: boolean): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'GET',
        url: useConfigurationStore().config.userServiceURL + userServiceUrlPart
      },
      lockscreen,
      null,
      true,
      'createEmailAccount - '
    );
  }

  public async createEmailAccount(createAccountRequest: CreateAccountRequest, lockscreen: boolean): Promise<RequestResponse<AccountInfo, ErrorData<UserServiceErrData>>> {
      return this.userServicePostCall<PasswordAuthenticateRequest, AccountInfo, UserServiceErrData>(queries.userService.EMAIL_CREATE_ACCOUNT, createAccountRequest, lockscreen);
  }

  public async authEmailAccount(emailAccount: PasswordAuthenticateRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>> {
    return this.userServicePostCall<PasswordAuthenticateRequest, Jwt, UserServiceErrData>(queries.userService.AUTHENTICATE_EMAIL, emailAccount, lockscreen);
  }

  public async authWalletInit(initWalletAuth: InitWalletAuthRequest, lockscreen: boolean): Promise<RequestResponse<InitWalletAuthResponse, ErrorData<UserServiceErrData>>> {
    return this.userServicePostCall<InitWalletAuthRequest, InitWalletAuthResponse, UserServiceErrData>(queries.userService.INIT_WALLET_AUTH, initWalletAuth, lockscreen);
  }
  public async authWalletKeplr(walletAuth: WalletAuthRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>> {
    return this.userServicePostCall<WalletAuthRequest, Jwt, UserServiceErrData>(queries.userService.AUTHENTICATE_KEPLR, walletAuth, lockscreen);
  }
  public async authWalletMetamask(walletAuth: WalletAuthRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>> {
    return this.userServicePostCall<WalletAuthRequest, Jwt, UserServiceErrData>(queries.userService.AUTHENTICATE_METAMASK, walletAuth, lockscreen);
  }

  public async activateEmailAccount(code: string, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>> {
    return this.userServiceGetCall<PasswordAuthenticateRequest, Jwt, UserServiceErrData>(formatString(queries.userService.ACTIVATE_ACCOUNT, {activationCode: code}), lockscreen);
  }
}

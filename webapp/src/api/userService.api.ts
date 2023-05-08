import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {EmailAccount} from "@/models/user/emailAccount";
import {useConfigurationStore} from "@/store/configuration.store";
import {RequestResponse} from "@/models/request-response";
import {AirdropErrData, BlockchainApiErrorData} from "@/models/blockchain/common";
import {AccountInfo} from "@/models/user/accountInfo";
import {UserServiceErrData} from "@/models/user/userServiceCommons";
import queries from "@/api/queries";
import {CampaignsInfo} from "@/models/airdrop/airdrop";
import {Jwt} from "@/models/user/jwt";

export class UserServiceApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.USER_SERVICE_API;
  }

  private userServicePostCall<R, T, E>(userServiceUrlPart: string, data: R, lockscreen: boolean): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'POST',
        url: userServiceUrlPart,
        data: data
      },
      lockscreen,
      null,
      true,
      'createEmailAccount - '
    );
  }

  public async createEmailAccount(emailAccount: EmailAccount, lockscreen: boolean): Promise<RequestResponse<AccountInfo, ErrorData<UserServiceErrData>>> {
      return this.userServicePostCall<EmailAccount, AccountInfo, UserServiceErrData>(queries.userService.EMAIL_CREATE_ACCOUNT, emailAccount, lockscreen);
  }

  public async authEmailAccount(emailAccount: EmailAccount, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>> {
    return this.userServicePostCall<EmailAccount, Jwt, UserServiceErrData>(queries.userService.EMAIL_CREATE_ACCOUNT, emailAccount, lockscreen);
  }
}

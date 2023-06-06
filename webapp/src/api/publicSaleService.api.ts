import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import { AccountRequest, CreateAccountRequest, PasswordAuthenticateRequest } from "@/models/user/passwordAuth";
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
import {
  EmailPairingConfirmationReq,
  EmailPairingRequest,
  EmailPairingRes, MetamaskKeplrPairingReq,
  SignedEmailPairingRequest
} from "@/models/user/emailPairing";
import {formatString} from "@/utils/string-formatter";
import {
  BlockchainInfo,
  InitPaymentSessionRequest,
  InitPaymentSessionResponse,
  ReserveTokensRequest,
  ReserveTokensResponse, TokenPaymentProofRequest, TokenReservationResponse
} from "@/models/saleServiceCommons";
import {InitSessionResponse, KycStatusResponse, KycTier, SessionOverviewResponse} from "@/models/user/kyc";
import {ValidatorsResponse} from "@/models/blockchain/validator";
import {mapValidators} from "@/models/mapper/validator.mapper";
import {mapKycSteps} from "@/models/mapper/synaps.mapper";
import {KeybaseErrorData} from "@/models/keybase/keybase";

export class PublicSaleServiceApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.PUBLIC_SALE_SERVICE_API;
  }

  private publicSaleServicePostCall<R, T, E>(userServiceUrlPart: string, data: R, lockscreen: boolean, logPrefix: string): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'POST',
        url: useConfigurationStore().config.publicSaleServiceURL + userServiceUrlPart,
        data: data
      },
      lockscreen,
      null,
      true,
      logPrefix
    );
  }
  private publicSaleServicePostEmptyCall<R, T, E>(userServiceUrlPart: string, lockscreen: boolean, logPrefix: string): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'POST',
        url: useConfigurationStore().config.publicSaleServiceURL + userServiceUrlPart,
      },
      lockscreen,
      null,
      true,
        logPrefix
    );
  }

  private publicSaleServiceGetCall<T, E>(userServiceUrlPart: string, lockscreen: boolean, logPrefix: string): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'GET',
        url: useConfigurationStore().config.publicSaleServiceURL + userServiceUrlPart
      },
      lockscreen,
      null,
      true,
      logPrefix
    );
  }
  public async getAccount(lockscreen: boolean): Promise<RequestResponse<AccountRequest, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServiceGetCall<AccountRequest, UserServiceErrData>(queries.publicSaleService.GET_ACCOUNT_INFO, lockscreen, "getAccount");
  }
  public async acceptTerms(lockscreen: boolean): Promise<RequestResponse<AccountInfo, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostEmptyCall<PasswordAuthenticateRequest, AccountInfo, UserServiceErrData>(queries.publicSaleService.ACCEPT_TERMS, lockscreen, "acceptTerms");
  }
  public async createEmailAccount(createAccountRequest: CreateAccountRequest, lockscreen: boolean): Promise<RequestResponse<AccountInfo, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<PasswordAuthenticateRequest, AccountInfo, UserServiceErrData>(queries.publicSaleService.EMAIL_CREATE_ACCOUNT, createAccountRequest, lockscreen, "createEmailAccount");
  }

  public async authEmailAccount(emailAccount: PasswordAuthenticateRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<PasswordAuthenticateRequest, Jwt, UserServiceErrData>(queries.publicSaleService.AUTHENTICATE_EMAIL, emailAccount, lockscreen, "authEmailAccount");
  }

  public async authWalletInit(initWalletAuth: InitWalletAuthRequest, lockscreen: boolean): Promise<RequestResponse<InitWalletAuthResponse, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<InitWalletAuthRequest, InitWalletAuthResponse, UserServiceErrData>(queries.publicSaleService.INIT_WALLET_AUTH, initWalletAuth, lockscreen, "authWalletInit");
  }
  public async authWalletKeplr(walletAuth: WalletAuthRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<WalletAuthRequest, Jwt, UserServiceErrData>(queries.publicSaleService.AUTHENTICATE_KEPLR, walletAuth, lockscreen, "authWalletKeplr");
  }
  public async authWalletMetamask(walletAuth: WalletAuthRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<WalletAuthRequest, Jwt, UserServiceErrData>(queries.publicSaleService.AUTHENTICATE_METAMASK, walletAuth, lockscreen, "authWalletMetamask");
  }

  public async activateEmailAccount(code: string, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServiceGetCall<Jwt, UserServiceErrData>(formatString(queries.publicSaleService.ACTIVATE_ACCOUNT, {activationCode: code}), lockscreen, "activateEmailAccount");
  }
  public initPairEmailKeplr(emailPairing: EmailPairingRequest, lockscreen: boolean): Promise<RequestResponse<EmailPairingRes, ErrorData<UserServiceErrData>>>{
    return this.publicSaleServicePostCall<EmailPairingRequest, EmailPairingRes, UserServiceErrData>(queries.publicSaleService.INIT_PAIR_EMAIL_KEPLR, emailPairing, lockscreen ,"initPairEmailKeplr");
  }
  public confirmEmailPairingKeplr(emailPairing: SignedEmailPairingRequest, lockscreen: boolean): Promise<RequestResponse<EmailPairingRes, ErrorData<UserServiceErrData>>>{
    return this.publicSaleServicePostCall<SignedEmailPairingRequest, EmailPairingRes, UserServiceErrData>(queries.publicSaleService.CONFIRM_SIGNED_EMAIL_KEPLR_DATA, emailPairing, lockscreen, "confirmEmailPairingKeplr");
  }
  public verifyPairingEmailKeplr(emailPairingVerification: EmailPairingConfirmationReq, lockscreen: boolean): Promise<RequestResponse<EmailPairingRes, ErrorData<UserServiceErrData>>>{
    return this.publicSaleServicePostCall< EmailPairingConfirmationReq, EmailPairingRes, UserServiceErrData>(queries.publicSaleService.VERIFY_EMAIL_KEPLR, emailPairingVerification, lockscreen, "verifyPairingEmailKeplr");
  }
  public initPairMetamaskKeplr(emailPairing: EmailPairingRequest, lockscreen: boolean): Promise<RequestResponse<EmailPairingRes, ErrorData<UserServiceErrData>>>{
    return this.publicSaleServicePostCall<EmailPairingRequest, EmailPairingRes, UserServiceErrData>(queries.publicSaleService.INIT_PAIR_METAMASK_KEPLR, emailPairing, lockscreen, "initPairMetamaskKeplr");
  }
  public verifyPairingMetamaskKeplr(emailPairingVerification: MetamaskKeplrPairingReq, lockscreen: boolean): Promise<RequestResponse<EmailPairingRes, ErrorData<UserServiceErrData>>>{
    return this.publicSaleServicePostCall<MetamaskKeplrPairingReq, EmailPairingRes, UserServiceErrData>(queries.publicSaleService.VERIFY_METAMASK_KEPLR, emailPairingVerification, lockscreen, "verifyPairingMetamaskKeplr");
  }

  public async reserveTokens(amount: number, lockscreen: boolean): Promise<RequestResponse<ReserveTokensResponse, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<ReserveTokensRequest, ReserveTokensResponse, UserServiceErrData>(queries.publicSaleService.RESERVE_TOKENS, {amount: amount}, lockscreen, "reserveTokens");
  }

  public async initPaymentSession(initPaymentSessionRequest: InitPaymentSessionRequest, lockscreen: boolean): Promise<RequestResponse<InitPaymentSessionResponse, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<InitPaymentSessionRequest, InitPaymentSessionResponse, UserServiceErrData>(queries.publicSaleService.INIT_PAYMENT_SESSION, initPaymentSessionRequest, lockscreen, "initPaymentSession");
  }

  public async fetchReservationList(lockscreen: boolean): Promise<RequestResponse<TokenReservationResponse[], ErrorData<UserServiceErrData>>> {
    return this.publicSaleServiceGetCall<TokenReservationResponse[], UserServiceErrData>(queries.publicSaleService.TOKEN_RESERVATION_LIST, lockscreen, "fetchReservationList");
  }

  public async initKycSession(lockscreen: boolean): Promise<RequestResponse<InitSessionResponse, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServiceGetCall<InitSessionResponse, UserServiceErrData>(queries.publicSaleService.KYC_INIT_SESSION, lockscreen, "initKycSession");
  }

  public async getKycStatus(lockscreen: boolean): Promise<RequestResponse<KycStatusResponse, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServiceGetCall<KycStatusResponse, UserServiceErrData>(queries.publicSaleService.GET_KYC_STATUS, lockscreen, "getKycStatus");
  }

  public async provideTxPaymentProof(txPaymentProof: TokenPaymentProofRequest,lockscreen: boolean): Promise<RequestResponse<null, ErrorData<UserServiceErrData>>> {
    return this.publicSaleServicePostCall<TokenPaymentProofRequest, null, UserServiceErrData>(queries.publicSaleService.PROVIDE_TX_PAYMENT_PROOF, txPaymentProof,lockscreen, "provideTxPaymentProof");
  }

  public async fetchBlockchainInfo(lockscreen: boolean): Promise<RequestResponse<BlockchainInfo[], ErrorData<UserServiceErrData>>> {
    return this.publicSaleServiceGetCall<BlockchainInfo[], UserServiceErrData>(queries.publicSaleService.BLOCKCHAIN_INFO, lockscreen, "getBlockchainInfo");
  }

  public async synapsFetchSessionDetails(sessionId: string, lockscreen: boolean): Promise<RequestResponse<KycTier, ErrorData<UserServiceErrData>>> {
    const mapData = (hasureData: SessionOverviewResponse | undefined) => {
      return mapKycSteps(hasureData);
    };
    const messages = {
      errorResponseName: 'Synaps data Error',
      errorResponseMassage: 'Synaps data error received',
      errorResponseToast: 'Synaps data Error: ',
      mappingErrorMassage: 'Synaps data mapping error: ',
    };
    const isResponseError = (response: RequestResponse<SessionOverviewResponse, ErrorData<UserServiceErrData>>) => {return response.isError();};
    return this.axiosWith200ErrorCall<KycTier, SessionOverviewResponse, UserServiceErrData>({
        method: 'GET',
        url: queries.synaps.OVERVIEW,
      headers: {
          'Session-Id': sessionId
      }
      },
      mapData,
      lockscreen,
      null,
      'synapsFetchSessionDetails - ',
      isResponseError,
      true,
      messages
    );
  }
}

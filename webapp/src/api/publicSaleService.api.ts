import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import { AccountRequest, CreateAccountRequest, PasswordAuthenticateRequest } from "@/models/user/passwordAuth";
import {useConfigurationStore} from "@/store/configuration.store";
import {EmptyResponse, RequestResponse} from "@/models/request-response";
import {AccountInfo} from "@/models/user/accountInfo";
import queries from "@/api/queries";
import {Jwt} from "@/models/user/jwt";
import {
  InitWalletAuthRequest,
  InitWalletAuthResponse,
  WalletAuthRequest
} from "@/models/user/walletAuth";
import {
  EmailMetamaskPairingRequest,
  EmailPairingConfirmationReq,
  EmailPairingRequest,
  EmailPairingRes, MetamaskKeplrPairingReq,
  SignedEmailPairingRequest, SignParingAddressResult
} from "@/models/user/emailPairing";
import {formatString} from "@/utils/string-formatter";
import {
  BlockchainInfo, CancelReservationRequest,
  InitPaymentSessionRequest,
  InitPaymentSessionResponse,
  ReserveTokensRequest,
  ReserveTokensResponse,
  RoundInfoBlockchainInfo, RoundInfoListMapped,
  RoundInfoResponse, SaleServiceApplicationError,
  TokenPaymentProofRequest,
  TokenReservationResponse
} from "@/models/saleServiceCommons";
import {InitSessionResponse, KycStatusResponse, KycTier, SessionOverviewResponse} from "@/models/user/kyc";
import {mapKycSteps} from "@/models/mapper/synaps.mapper";
import {mapRoundInfo, mapRoundInfoList, mapTokenReservations} from "@/models/mapper/publicSale.mapper";
import {TokenReservation} from "@/store/publicSales.store";

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
      logPrefix
    );
  }
  public async getAccount(lockscreen: boolean): Promise<RequestResponse<AccountRequest, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServiceGetCall<AccountRequest, SaleServiceApplicationError>(queries.publicSaleService.GET_ACCOUNT_INFO, lockscreen, "getAccount");
  }
  public async acceptTerms(lockscreen: boolean): Promise<RequestResponse<AccountInfo, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServicePostEmptyCall<PasswordAuthenticateRequest, AccountInfo, SaleServiceApplicationError>(queries.publicSaleService.ACCEPT_TERMS, lockscreen, "acceptTerms");
  }

  public async logout(lockscreen: boolean): Promise<RequestResponse<undefined, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServiceGetCall<undefined, SaleServiceApplicationError>(queries.publicSaleService.LOGOUT, lockscreen, "logout");
  }
  public async createEmailAccount(createAccountRequest: CreateAccountRequest, lockscreen: boolean): Promise<RequestResponse<AccountInfo, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServicePostCall<PasswordAuthenticateRequest, AccountInfo, SaleServiceApplicationError>(queries.publicSaleService.EMAIL_CREATE_ACCOUNT, createAccountRequest, lockscreen, "createEmailAccount");
  }

  public async authEmailAccount(emailAccount: PasswordAuthenticateRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServicePostCall<PasswordAuthenticateRequest, Jwt, SaleServiceApplicationError>(queries.publicSaleService.AUTHENTICATE_EMAIL, emailAccount, lockscreen, "authEmailAccount");
  }

  public async authWalletInit(initWalletAuth: InitWalletAuthRequest, lockscreen: boolean): Promise<RequestResponse<InitWalletAuthResponse, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServicePostCall<InitWalletAuthRequest, InitWalletAuthResponse, SaleServiceApplicationError>(queries.publicSaleService.INIT_WALLET_AUTH, initWalletAuth, lockscreen, "authWalletInit");
  }
  public async authWalletKeplr(walletAuth: WalletAuthRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServicePostCall<WalletAuthRequest, Jwt, SaleServiceApplicationError>(queries.publicSaleService.AUTHENTICATE_KEPLR, walletAuth, lockscreen, "authWalletKeplr");
  }
  public async authWalletMetamask(walletAuth: WalletAuthRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServicePostCall<WalletAuthRequest, Jwt, SaleServiceApplicationError>(queries.publicSaleService.AUTHENTICATE_METAMASK, walletAuth, lockscreen, "authWalletMetamask");
  }

  public async activateEmailAccount(code: string, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServiceGetCall<Jwt, SaleServiceApplicationError>(formatString(queries.publicSaleService.ACTIVATE_ACCOUNT, {activationCode: code}), lockscreen, "activateEmailAccount");
  }
  public initPairEmailKeplr(emailPairing: EmailPairingRequest, lockscreen: boolean): Promise<RequestResponse<EmailPairingRes, ErrorData<SaleServiceApplicationError>>>{
    return this.publicSaleServicePostCall<EmailPairingRequest, EmailPairingRes, SaleServiceApplicationError>(queries.publicSaleService.INIT_PAIR_EMAIL_KEPLR, emailPairing, lockscreen ,"initPairEmailKeplr");
  }
  public confirmEmailPairingKeplr(emailPairing: SignedEmailPairingRequest, lockscreen: boolean): Promise<RequestResponse<EmailPairingRes, ErrorData<SaleServiceApplicationError>>>{
    return this.publicSaleServicePostCall<SignedEmailPairingRequest, EmailPairingRes, SaleServiceApplicationError>(queries.publicSaleService.CONFIRM_SIGNED_EMAIL_KEPLR_DATA, emailPairing, lockscreen, "confirmEmailPairingKeplr");
  }
  public verifyPairingEmailKeplr(emailPairingVerification: EmailPairingConfirmationReq, lockscreen: boolean): Promise<RequestResponse<EmailPairingRes, ErrorData<SaleServiceApplicationError>>>{
    return this.publicSaleServicePostCall< EmailPairingConfirmationReq, EmailPairingRes, SaleServiceApplicationError>(queries.publicSaleService.VERIFY_EMAIL_KEPLR, emailPairingVerification, lockscreen, "verifyPairingEmailKeplr");
  }

  public emailKeplrPairingDataVerify(emailPairingVerification: SignParingAddressResult, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<SaleServiceApplicationError>>>{
    return this.publicSaleServicePostCall< SignParingAddressResult, Jwt, SaleServiceApplicationError>(queries.publicSaleService.VERIFY_EMAIL_KEPLR, emailPairingVerification, lockscreen, "emailKeplrPairingDataVerify");
  }

  public initEmailMetamaskPairing(emailPairingVerification: EmailMetamaskPairingRequest, lockscreen: boolean): Promise<RequestResponse<EmailPairingRes, ErrorData<SaleServiceApplicationError>>>{
    return this.publicSaleServicePostCall< EmailMetamaskPairingRequest, EmailPairingRes, SaleServiceApplicationError>(queries.publicSaleService.INIT_PAIR_EMAIL_METAMASK, emailPairingVerification, lockscreen, "initEmailMetamaskPairing");
  }

  public initPairMetamaskKeplr(emailPairing: EmailPairingRequest, lockscreen: boolean): Promise<RequestResponse<EmailPairingRes, ErrorData<SaleServiceApplicationError>>>{
    return this.publicSaleServicePostCall<EmailPairingRequest, EmailPairingRes, SaleServiceApplicationError>(queries.publicSaleService.INIT_PAIR_METAMASK_KEPLR, emailPairing, lockscreen, "initPairMetamaskKeplr");
  }

  public emailMetamaskPairingDataVerify(signedData: SignedEmailPairingRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<SaleServiceApplicationError>>>{
    return this.publicSaleServicePostCall<SignedEmailPairingRequest, Jwt, SaleServiceApplicationError>(queries.publicSaleService.VERIFY_EMAIL_METAMASK, signedData, lockscreen, "emailMetamaskPairingDataVerify");
  }

  public verifyPairingMetamaskKeplr(emailPairingVerification: MetamaskKeplrPairingReq, lockscreen: boolean): Promise<RequestResponse<EmailPairingRes, ErrorData<SaleServiceApplicationError>>>{
    return this.publicSaleServicePostCall<MetamaskKeplrPairingReq, EmailPairingRes, SaleServiceApplicationError>(queries.publicSaleService.VERIFY_METAMASK_KEPLR, emailPairingVerification, lockscreen, "verifyPairingMetamaskKeplr");
  }

  public async reserveTokens(roundId: number, amount: number, lockscreen: boolean): Promise<RequestResponse<ReserveTokensResponse, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServicePostCall<ReserveTokensRequest, ReserveTokensResponse, SaleServiceApplicationError>(queries.publicSaleService.RESERVE_TOKENS, {roundId: roundId, amount: amount}, lockscreen, "reserveTokens");
  }

  public async cancelReservation(orderId: number, lockscreen: boolean): Promise<RequestResponse<EmptyResponse, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServicePostCall<CancelReservationRequest, EmptyResponse, SaleServiceApplicationError>(queries.publicSaleService.CANCEL_RESERVATION, {orderId: orderId}, lockscreen, "cancelReservation");
  }

  public async initPaymentSession(initPaymentSessionRequest: InitPaymentSessionRequest, lockscreen: boolean): Promise<RequestResponse<InitPaymentSessionResponse, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServicePostCall<InitPaymentSessionRequest, InitPaymentSessionResponse, SaleServiceApplicationError>(queries.publicSaleService.INIT_PAYMENT_SESSION, initPaymentSessionRequest, lockscreen, "initPaymentSession");
  }

  public async fetchReservationList(lockscreen: boolean): Promise<RequestResponse<TokenReservation[], ErrorData<SaleServiceApplicationError>>> {
    const mapData = (tokenReservationList: TokenReservationResponse[] | undefined) => {
      return mapTokenReservations(tokenReservationList);
    };
    const messages = {
      errorResponseName: 'Token reservation data Error',
      errorResponseMassage: 'Token reservation data error received',
      errorResponseToast: 'Token reservation data Error: ',
      mappingErrorMassage: 'Token reservation data mapping error: ',
    };
    const isResponseError = (response: RequestResponse<TokenReservationResponse[], ErrorData<SaleServiceApplicationError>>) => {return response.isError();};
    return this.axiosWith200ErrorCall<TokenReservation[], TokenReservationResponse[], SaleServiceApplicationError>({
        method: 'GET',
        url: useConfigurationStore().config.publicSaleServiceURL + queries.publicSaleService.TOKEN_RESERVATION_LIST
      },
      mapData,
      lockscreen,
      null,
      'fetchReservationList - ',
      isResponseError,
      messages
    );
  //  return this.publicSaleServiceGetCall<TokenReservationResponse[], UserServiceErrData>(queries.publicSaleService.TOKEN_RESERVATION_LIST, lockscreen, "fetchReservationList");
  }

  public async initKycSession(lockscreen: boolean): Promise<RequestResponse<InitSessionResponse, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServiceGetCall<InitSessionResponse, SaleServiceApplicationError>(queries.publicSaleService.KYC_INIT_SESSION, lockscreen, "initKycSession");
  }

  public async getKycStatus(lockscreen: boolean): Promise<RequestResponse<KycStatusResponse, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServiceGetCall<KycStatusResponse, SaleServiceApplicationError>(queries.publicSaleService.GET_KYC_STATUS, lockscreen, "getKycStatus");
  }

  public async provideTxPaymentProof(txPaymentProof: TokenPaymentProofRequest,lockscreen: boolean): Promise<RequestResponse<null, ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServicePostCall<TokenPaymentProofRequest, null, SaleServiceApplicationError>(queries.publicSaleService.PROVIDE_TX_PAYMENT_PROOF, txPaymentProof,lockscreen, "provideTxPaymentProof");
  }

  public async fetchBlockchainInfo(lockscreen: boolean): Promise<RequestResponse<BlockchainInfo[], ErrorData<SaleServiceApplicationError>>> {
    return this.publicSaleServiceGetCall<BlockchainInfo[], SaleServiceApplicationError>(queries.publicSaleService.BLOCKCHAIN_INFO, lockscreen, "getBlockchainInfo");
  }

  public async fetchRoundInfo(roundId: number,lockscreen: boolean): Promise<RequestResponse<RoundInfoBlockchainInfo, ErrorData<SaleServiceApplicationError>>> {
    const mapData = (roundInfo: RoundInfoResponse | undefined) => {
      return mapRoundInfo(roundInfo);
    };
    const messages = {
      errorResponseName: 'RoundInfo data Error',
      errorResponseMassage: 'RoundInfo data error received',
      errorResponseToast: 'RoundInfo data Error: ',
      mappingErrorMassage: 'RoundInfo data mapping error: ',
    };
    const isResponseError = (response: RequestResponse<RoundInfoResponse, ErrorData<SaleServiceApplicationError>>) => {return response.isError();};
    return this.axiosWith200ErrorCall<RoundInfoBlockchainInfo, RoundInfoResponse, SaleServiceApplicationError>({
        method: 'GET',
        url: useConfigurationStore().config.publicSaleServiceURL + formatString(queries.publicSaleService.ROUND_INFO, {roundId: roundId}),
      },
      mapData,
      lockscreen,
      null,
      'fetchRoundInfo - ',
      isResponseError,
      messages
    );
  }

  public async fetchRoundInfoList(lockscreen: boolean): Promise<RequestResponse<RoundInfoListMapped, ErrorData<SaleServiceApplicationError>>> {
    const mapData = (roundInfo: RoundInfoResponse[] | undefined) => {
      return mapRoundInfoList(roundInfo);
    };
    const messages = {
      errorResponseName: 'RoundInfoList data Error',
      errorResponseMassage: 'RoundInfoList data error received',
      errorResponseToast: 'RoundInfoList data Error: ',
      mappingErrorMassage: 'RoundInfoList data mapping error: ',
    };
    const isResponseError = (response: RequestResponse<RoundInfoResponse[], ErrorData<SaleServiceApplicationError>>) => {return response.isError();};
    return this.axiosWith200ErrorCall<RoundInfoListMapped, RoundInfoResponse[], SaleServiceApplicationError>({
        method: 'GET',
        url: useConfigurationStore().config.publicSaleServiceURL + queries.publicSaleService.ROUND_INFO_LIST,
      },
      mapData,
      lockscreen,
      null,
      'fetchRoundInfo - ',
      isResponseError,
      messages
    );
  }

  public async synapsFetchSessionDetails(sessionId: string, lockscreen: boolean): Promise<RequestResponse<KycTier, ErrorData<SaleServiceApplicationError>>> {
    const mapData = (hasureData: SessionOverviewResponse | undefined) => {
      return mapKycSteps(hasureData);
    };
    const messages = {
      errorResponseName: 'Synaps data Error',
      errorResponseMassage: 'Synaps data error received',
      errorResponseToast: 'Synaps data Error: ',
      mappingErrorMassage: 'Synaps data mapping error: ',
    };
    const isResponseError = (response: RequestResponse<SessionOverviewResponse, ErrorData<SaleServiceApplicationError>>) => {return response.isError();};
    return this.axiosWith200ErrorCall<KycTier, SessionOverviewResponse, SaleServiceApplicationError>({
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
      messages
    );
  }
}

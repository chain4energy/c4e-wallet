import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {CreateAccountRequest, PasswordAuthenticateRequest} from "@/models/user/passwordAuth";
import {clearAuthTokens, setAuthTokens} from "axios-jwt";
import {InitWalletAuthRequest, WalletAuthRequest} from "@/models/user/walletAuth";
import {useUserStore} from "@/store/user.store";
import {RequestResponse} from "@/models/request-response";
import {ErrorData} from "@/api/base.api";
import {Jwt} from "@/models/user/jwt";
import {EmailPairingRequest, EmailPairingRes, SignParingAddressResult} from "@/models/user/emailPairing";
import {usePublicSalesStore} from "@/store/publicSales.store";
import {KycProgressStatus, KycStepInfo, KycStepName, KycTierEnum} from "@/models/user/kyc";
import {TxBroadcastError} from "@/api/tx.broadcast.base.api";
import {ethers} from "ethers";
import {useContextStore} from "@/store/context.store";
import {SaleServiceApplicationError} from "@/models/saleServiceCommons";
import {UserServiceContext, UserServiceErrorHandler} from "@/store/errorsHandlers/userServiceErrorHandler";

interface UserServiceState {
  loginType: LoginTypeEnum,
  kycSessionId: string
  paired: boolean,
  userEmail: string | undefined,
  verificationNeeded: boolean,
  termsAccepted: boolean,
  ethereumAddress?: string,
  claimAddress?: string,
  kycServiceState: Map<KycStepName, KycProgressStatus>,
  kycLevel: number,
  loggedIn: boolean
}

export enum LoginTypeEnum {
  EMAIL="EMAIL",
  KEPLR="KEPLR",
  METAMASK="METAMASK",
  NONE="NONE"
}


export const useUserServiceStore = defineStore({
  id: 'userServiceStore',
  state: (): UserServiceState => {
    return {
      loginType: LoginTypeEnum.NONE,
      kycSessionId: '',
      paired: false,
      userEmail: undefined,
      verificationNeeded: false,
      termsAccepted: false,
      ethereumAddress: undefined,
      claimAddress: undefined,
      kycServiceState: new Map<KycStepName, KycProgressStatus>(),
      kycLevel: 0,
      loggedIn: false
    };
  },
  actions: {
    async getAccount(onSuccess: (() => void), onFail?: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().getAccount(lockscreen).then(response => {
        if(response.isSuccess() && response.data) {
          this.termsAccepted = response.data.terms;
          this.loginType = response.data.accountType;
          this.userEmail = response.data.login;
          this.ethereumAddress = response.data.ethereumAddress == '' ? undefined : response.data.ethereumAddress;
          this.claimAddress = response.data?.claimAddress == '' ? undefined : response.data.claimAddress;
          this.kycLevel = response.data.kycInfo.kycLevel;
          const map = new Map<KycStepName, KycProgressStatus>();
          for(const [key, value] of Object.entries(response.data.kycInfo.kycServiceState)) {
            map.set(key as KycStepName, value as KycProgressStatus);
          }
          this.kycServiceState = map;

          onSuccess();
        } else {
          UserServiceErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    async getKycStatus() {
      await apiFactory.publicSaleServiceApi().getKycStatus(false).then(response => {
        if(response.isSuccess() && response.data) {
          const map = new Map<KycStepName, KycProgressStatus>();
          for(const [key, value] of Object.entries(response.data.kycServiceState)) {
            map.set(key as KycStepName, value as KycProgressStatus);
          }
          this.kycServiceState = map;
          this.kycLevel = response.data.kycLevel;
        } else {
          UserServiceErrorHandler.getInstance().handleError(response.error);
          // onFail?.();
        }
      });
    },
    async authWalletInit(initWalletAuthRequest: InitWalletAuthRequest,onSuccess: (() => void), onFail?: (() => void), lockscreen = true) {
       const initWalletAuthResponse = await apiFactory.publicSaleServiceApi().authWalletInit(initWalletAuthRequest, lockscreen);
       if(initWalletAuthResponse.isSuccess() && initWalletAuthResponse.data) {
         await apiFactory.accountApi().sign(useUserStore().connectionInfo, initWalletAuthResponse.data.dataToSign.randomString).then(signedDataResponse => {
           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
           // @ts-ignore
           this.authWalletKeplr({processID: initWalletAuthResponse.data.processID, signedData: signedDataResponse.data}, onSuccess, onFail);
         });
       } else {
         UserServiceErrorHandler.getInstance().handleError(initWalletAuthResponse.error);
         onFail?.();
       }
    },

    async authMetamaskWalletInit(initWalletAuthRequest: InitWalletAuthRequest, onSuccess: (() => void), onFail?: (() => void), lockscreen = true) {
      const initWalletAuthResponse = await apiFactory.publicSaleServiceApi().authWalletInit(initWalletAuthRequest, lockscreen);
      if(initWalletAuthResponse.isSuccess() && initWalletAuthResponse.data) {
        await apiFactory.accountApi().signMetamask(initWalletAuthResponse.data.dataToSign.randomString).then(signedDataResponse => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.authWalletMetamask({processID: initWalletAuthResponse.data.processID, signedData: signedDataResponse.data}, onSuccess, onFail);
        });
      } else {
        UserServiceErrorHandler.getInstance().handleError(initWalletAuthResponse.error);
        onFail?.();
      }
    },
    async createEmailAccount(createAccountRequest: CreateAccountRequest, onSuccess: (() => void), onFail?: (() => void), lockscreen = true) {
      return await apiFactory.publicSaleServiceApi().createEmailAccount(createAccountRequest, lockscreen).then(res => {
        if(res.isSuccess()) {
          onSuccess();
        } else {
          UserServiceErrorHandler.getInstance().handleError( res.error, UserServiceContext.CREATE_ACCOUNT);
          onFail?.();
        }
      });
    },
    async authWalletKeplr(walletAuthData: WalletAuthRequest, onSuccess: (() => void), onFail?: (() => void), lockscreen = true, ) {
      return await apiFactory.publicSaleServiceApi().authWalletKeplr(walletAuthData, lockscreen).then(response => {
        if(response.isSuccess()) {
          this.setTokens(response);
          onSuccess();
        } else {
          UserServiceErrorHandler.getInstance().handleError( response.error, UserServiceContext.LOG_IN);
          onFail?.();
        }
      });
    },
    async authWalletMetamask(walletAuthData: WalletAuthRequest,  onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().authWalletMetamask(walletAuthData, lockscreen).then(response => {
        if(response.isSuccess()) {
          this.setTokens(response);
          onSuccess();
        } else {
          UserServiceErrorHandler.getInstance().handleError( response.error, UserServiceContext.LOG_IN);
          onFail?.();
        }
      });
    },
    async authEmailAccount(emailAccount: PasswordAuthenticateRequest, onSuccess: (() => void), onFail?: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().authEmailAccount(emailAccount, lockscreen).then(responseDate => {
        if(responseDate.isSuccess()) {
          this.setTokens(responseDate);
          this.userEmail = emailAccount.login;
          onSuccess();
        } else {
          UserServiceErrorHandler.getInstance().handleError(responseDate.error, UserServiceContext.LOG_IN);
          onFail?.();
        }
      });
    },
    async activateEmailAccount(code: string, onSuccess: (() => void), onFail?: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().activateEmailAccount(code, lockscreen).then(responseDate => {
        if(responseDate.isSuccess()) {
          this.setTokens(responseDate);
          this.loginType = LoginTypeEnum.EMAIL;
          onSuccess();
        } else {
          UserServiceErrorHandler.getInstance().handleError(responseDate.error, UserServiceContext.ACTIVATE_EMAIL_ACCOUNT);
          onFail?.();
        }
      });
    },
    async initKycSession(lockscreen = true, onFail?: (() => void)) {
      await apiFactory.publicSaleServiceApi().initKycSession(lockscreen).then(response => {
        console.log(response);
        if(response.isSuccess() && response.data) {
          this.kycSessionId = response.data.session_id;
        } else {
          UserServiceErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    setTokens(responseDate: RequestResponse<Jwt, ErrorData<SaleServiceApplicationError>>){
        if(responseDate.data){
          this.loggedIn = true;
          setAuthTokens({
            accessToken: responseDate.data.access_token.token,
            refreshToken: responseDate.data.refresh_token.token
          });
        } else {
          //TODO: toast - log in error
        }
    },
    async initEmailKeplrPairing(claimedAddress: string, onSuccess: (() => void), onFail?: (() => void), lockscreen=true) {
      await apiFactory.publicSaleServiceApi().initPairEmailKeplr({claimedAddress: claimedAddress}, lockscreen).then(async (response) => {
        if (response.isSuccess() && response.data) {
          useContextStore().dataToSign = response.data;
          onSuccess();
        } else {
          UserServiceErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    async provideKeplrAddress(emailAccount: EmailPairingRequest, onSuccess: ((response: SignParingAddressResult) => void), onFail?: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().initPairEmailKeplr(emailAccount, lockscreen).then(async (response) => {
        if (response.isSuccess() && response.data) {
          await this.signPairingEmailKeplr(response.data).then(resp=>{
            if(response.data && resp.data) {
              onSuccess({processID: response.data?.processID, signedData: resp.data});
            }
          });
        } else {
          UserServiceErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    async signPairingEmailKeplr(responseData: EmailPairingRes){
     return await apiFactory.accountApi().sign(useUserStore().connectionInfo, responseData.dataToSign.randomString).then(async (signedDataResponse: RequestResponse<string, TxBroadcastError>) => {
       if(signedDataResponse.isSuccess() && signedDataResponse.data){
         await this.approveSignedDataParingEmailKeplr(signedDataResponse.data, responseData.processID);
         return signedDataResponse;
       } else {
         return signedDataResponse;
       }
      });
    },
    async approveSignedDataParingEmailKeplr(signedDataResponse: string, processId: string, lockscreen = true) {
      await apiFactory.publicSaleServiceApi().confirmEmailPairingKeplr({processID: processId, signedData:signedDataResponse}, lockscreen).then(res =>{
        this.verificationNeeded = res.isSuccess();
        console.log(res);
      });
    },

    async verifyParingEmailKeplr(processID: string, pairingCode: string, signedData: string, onSuccess: (() => void), onFail?: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().verifyPairingEmailKeplr({pairingCode: pairingCode, processId: processID, signedData: signedData}, lockscreen).then(response => {
        if(response.isSuccess()){
          this.loginType = LoginTypeEnum.EMAIL;
          this.paired = true;
          this.verificationNeeded = false;
          onSuccess();
        }else {
          UserServiceErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    async switchBlockchain(chainId: number) {
      try {
        if (!window.ethereum) {
          throw new Error('MetaMask is not installed');
        }

        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.utils.hexValue(chainId) }],
        });
      } catch (error) {
        console.error('Error switching the blockchain network:', error);
      }
    },
    pairMetamaskAddress: async function(emailAccount: EmailPairingRequest, onSuccess: (() => void), onFail?: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().initPairMetamaskKeplr(emailAccount, lockscreen).then(async response => {
        if (response.isSuccess() && response.data) {
          await this.signPairingMatamaskKeplr(response.data, onSuccess, onFail, true);
          // this.setIsLoggedIn();
          // this.loginType = LoginTypeEnum.EMAIL;
          // this.paired = true;
        } else {
          UserServiceErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    async initEmailMetamaskPairing(paymentAddress: string, onSuccess: (() => void), onFail?: (() => void), lockscreen=true){
      await apiFactory.publicSaleServiceApi().initEmailMetamaskPairing({paymentAddress: paymentAddress}, lockscreen).then((response) => {
        if(response.isSuccess() && response.data) {
          useContextStore().dataToSign = response.data;
          onSuccess();
        } else {
          UserServiceErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    async emailMetamaskPairingDataVerify(processID: string, signedData: string, onSuccess: (() => void), onFail?: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().emailMetamaskPairingDataVerify({processID: processID, signedData: signedData}, lockscreen).then((response) => {
        if(response.isSuccess()) {
          onSuccess();
        } else {
          UserServiceErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    async emailKeplrPairingDataVerify(processID: string, signedData: string, onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().emailKeplrPairingDataVerify({processID: processID, signedData: signedData}, lockscreen).then((response) => {
        if(response.isSuccess()) {
          onSuccess();
        } else {
          UserServiceErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    async signPairingMatamaskKeplr(responseData: EmailPairingRes, onSuccess: (() => void), onFail?: (() => void), lockscreen = true){
      let metamaskResp = '';
      let keplrResp = '';
      try{
        await apiFactory.accountApi().sign(useUserStore().connectionInfo, responseData.dataToSign.randomString).then(async (signedDataResponse: RequestResponse<string, TxBroadcastError>) => {
          if(signedDataResponse.isSuccess() && signedDataResponse.data){
            keplrResp = signedDataResponse.data;
            await apiFactory.accountApi().signMetamaskPairing(signedDataResponse.data).then(async (signedDataResponseMetamask: RequestResponse<string, TxBroadcastError>)=>{
              if(signedDataResponseMetamask.isSuccess() && signedDataResponseMetamask.data) {
                metamaskResp = signedDataResponseMetamask.data;
              }
            });
          }
        });
      }catch (e) {
        return e;
      } finally {
        if(metamaskResp != '' && keplrResp != ''){
          await apiFactory.publicSaleServiceApi().verifyPairingMetamaskKeplr(
            {
              keplrSignedData: keplrResp,
              metamaskSignedData: metamaskResp,
              processID: responseData.processID,
            }, true).then((response)=>{
            if(response.isSuccess()){
              this.loginType = LoginTypeEnum.METAMASK;
              this.paired = true;
              this.verificationNeeded = false;
            } else {
              UserServiceErrorHandler.getInstance().handleError(response.error);
            }
          });
        }
      }
    },

    async approveTerms(onSuccess: (() => void), onFail?: (() => void), lockscreen = true){
      await apiFactory.publicSaleServiceApi().acceptTerms(lockscreen).then(response =>{
        if(response.isSuccess()){
          this.getAccount(onSuccess, onFail, true);
        } else {
          UserServiceErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    logoutAccount(){
      apiFactory.publicSaleServiceApi().logout(true).then(() => {
        clearAuthTokens();
      });

      useContextStore().$reset();
      usePublicSalesStore().logoutAccount();
      this.loginType =  LoginTypeEnum.NONE;
      this.kycSessionId = '';
      this.paired= false;
      this.userEmail= undefined;
      this.verificationNeeded= false;
      this.termsAccepted= false;
      this.ethereumAddress= undefined;
      this.claimAddress= undefined;
      this.kycServiceState= new Map<KycStepName, KycProgressStatus>();
      this.kycLevel= 0;
      this.loggedIn = false;

    }
  },
  getters: {

    getLoginType(): LoginTypeEnum {
      return this.loginType;
    },
    isPaired(): boolean{
      return this.paired;
    },
    getUserEmail(): string| undefined{
      return this.userEmail;
    },
    getKycSessionId(): string {
      return this.kycSessionId;
    },
    getStepStatus(): (stepName: KycStepName) => KycProgressStatus | undefined {
      return (stepName ) => {
        return this.kycServiceState.get(stepName);
      };
    },
    getKycTierSteps(): (kycTier: KycTierEnum) => KycStepInfo[] {
      return (kycTier ) => {
        if(kycTier == KycTierEnum.TIER_1) {
          return [
            {
              name: KycStepName.LIVENESS,
              state: this.getStepStatus(KycStepName.LIVENESS)
            },
            {
              name: KycStepName.IDENTITY,
              state: this.getStepStatus(KycStepName.IDENTITY)
            }];
        } else if(kycTier == KycTierEnum.TIER_2) {
          return [
            {
              name: KycStepName.LIVENESS,
              state: this.getStepStatus(KycStepName.LIVENESS)
            },
            {
              name: KycStepName.IDENTITY,
              state: this.getStepStatus(KycStepName.IDENTITY)
            },
            {
              name: KycStepName.RESIDENCY,
              state: this.getStepStatus(KycStepName.RESIDENCY)
            },
          ];
        }
        return [];
      };
    },
    getKycTier(): KycTierEnum {
      // if(this.getStepStatus(KycStepName.IDENTITY) == KycProgressStatus.VALIDATED) {
      //   if(this.getStepStatus(KycStepName.LIVENESS) == KycProgressStatus.VALIDATED) {
      //     if(this.getStepStatus(KycStepName.PHONE) == KycProgressStatus.VALIDATED) {
      //       return KycTierEnum.TIER_3;
      //     } else {
      //       return KycTierEnum.TIER_2;
      //     }
      //   } else {
      //     return KycTierEnum.TIER_1;
      //   }
      // }
      return this.kycLevel;
    },
    isVerificationNeeded(): boolean{
      return this.verificationNeeded;
    },
    isTermsAccepted():boolean{
      return this.termsAccepted;
    },
    isLoggedIn():boolean {
      return this.loggedIn;
    },
  },
  persist: {
    enabled: true
  }
});

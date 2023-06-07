import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {CreateAccountRequest, PasswordAuthenticateRequest} from "@/models/user/passwordAuth";
import {clearAuthTokens, setAuthTokens} from "axios-jwt";
import {InitWalletAuthRequest, WalletAuthRequest} from "@/models/user/walletAuth";
import {useUserStore} from "@/store/user.store";
import {RequestResponse} from "@/models/request-response";
import {UserServiceErrData} from "@/models/user/userServiceCommons";
import {ErrorData} from "@/api/base.api";
import {Jwt} from "@/models/user/jwt";
import axios from "axios";
import { EmailPairingRequest, EmailPairingRes } from "@/models/user/emailPairing";
import {usePublicSalesStore} from "@/store/publicSales.store";
import {KycProgressStatus, KycStep, KycStepInfo, KycStepName, KycTierEnum, KycTier} from "@/models/user/kyc";
import { TxBroadcastError } from "@/api/tx.broadcast.base.api";
import {ethers} from "ethers";
import {MetamaskPayInfo, TokenPaymentProofRequest} from "@/models/saleServiceCommons";

interface UserServiceState {
  _isLoggedIn: boolean,
  loginType: LoginTypeEnum,
  kycSessionId: string
  paired: boolean,
  userEmail: string | undefined,
  metamaskAddress : string | undefined,
  kycSteps: KycStep[],
  verificationNeeded: boolean,
  termsAccepted: boolean,
}

export enum LoginTypeEnum {
  EMAIL,
  KEPLR,
  METAMASK,
  NONE
}


export const useUserServiceStore = defineStore({
  id: 'userServiceStore',
  state: (): UserServiceState => {
    return {
      _isLoggedIn: false,
      loginType: LoginTypeEnum.NONE,
      kycSessionId: '',
      paired: false,
      userEmail: undefined,
      kycSteps: Array<KycStep>(),
      metamaskAddress : undefined,
      verificationNeeded: false,
      termsAccepted: false,
    };
  },
  actions: {
    setIsLoggedIn() {
      this._isLoggedIn = true;
    },

    async getAccount(onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().getAccount(lockscreen).then(responseDate => {
        if(responseDate.isSuccess()) {
          console.log(responseDate.data?.terms)
          if(responseDate.data?.terms){
            this.termsAccepted = responseDate.data?.terms
          }
          onSuccess();
        } else {
          onFail();
        }
      });
    },
    async authWalletInit(initWalletAuthRequest: InitWalletAuthRequest,onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
       const initWalletAuthResponse = await apiFactory.publicSaleServiceApi().authWalletInit(initWalletAuthRequest, lockscreen);
       if(initWalletAuthResponse.isSuccess() && initWalletAuthResponse.data) {
         await apiFactory.accountApi().sign(useUserStore().connectionInfo, initWalletAuthResponse.data.dataToSign).then(signedDataResponse => {
           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
           // @ts-ignore
           this.authWalletKeplr({processID: initWalletAuthResponse.data.processID, signedData: signedDataResponse.data}, onSuccess, onFail);
         });
       } else {
         onFail();
       }
    },

    async authMetamaskWalletInit(initWalletAuthRequest: InitWalletAuthRequest, onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      const initWalletAuthResponse = await apiFactory.publicSaleServiceApi().authWalletInit(initWalletAuthRequest, lockscreen);
      if(initWalletAuthResponse.isSuccess() && initWalletAuthResponse.data) {
        await apiFactory.accountApi().signMetamask(initWalletAuthResponse.data.dataToSign).then(signedDataResponse => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.authWalletMetamask({processID: initWalletAuthResponse.data.processID, signedData: signedDataResponse.data}, onSuccess, onFail);
        });
      } else {
        onFail();
      }
    },
    async createEmailAccount(createAccountRequest: CreateAccountRequest, onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      return await apiFactory.publicSaleServiceApi().createEmailAccount(createAccountRequest, lockscreen).then(res => {
        if(res.isSuccess()) {
          onSuccess();
        } else {
          onFail();
        }
      });
    },
    async authWalletKeplr(walletAuthData: WalletAuthRequest, onSuccess: (() => void), onFail: (() => void), lockscreen = true, ) {
      return await apiFactory.publicSaleServiceApi().authWalletKeplr(walletAuthData, lockscreen).then(responseDate => {
        if(responseDate.isSuccess()) {
          onSuccess();
          this.setTokens(responseDate);
          this.loginType = LoginTypeEnum.KEPLR;
        } else {
          onFail();
        }
      });
    },
    async authWalletMetamask(walletAuthData: WalletAuthRequest,  onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().authWalletMetamask(walletAuthData, lockscreen).then(responseDate => {
        if(responseDate.isSuccess()) {
          this.setTokens(responseDate);
          this.loginType = LoginTypeEnum.METAMASK;
          onSuccess();
        } else {
          onFail();
        }
      });
    },
    async authEmailAccount(emailAccount: PasswordAuthenticateRequest, onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().authEmailAccount(emailAccount, lockscreen).then(responseDate => {
        if(responseDate.isSuccess()) {
          this.setTokens(responseDate);
          this.userEmail = emailAccount.login;
          this.loginType = LoginTypeEnum.EMAIL;
          onSuccess();
        } else {
          onFail();
        }
      });
    },
    async activateEmailAccount(code: string, onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().activateEmailAccount(code, lockscreen).then(responseDate => {
        if(responseDate.isSuccess()) {
          this.setTokens(responseDate);
          this.loginType = LoginTypeEnum.EMAIL;
          onSuccess();
        } else {
          onFail();
        }
      });
    },
    async initKycSession(lockscreen = true) {
      await apiFactory.publicSaleServiceApi().initKycSession(lockscreen).then(responseDate => {
        console.log(responseDate);
        if(responseDate.isSuccess() && responseDate.data) {
          this.kycSessionId = responseDate.data.session_id;
        }

      });
    },
    async fetchKycStatus(sessionId: string, lockscreen = true) {
      await apiFactory.publicSaleServiceApi().synapsFetchSessionDetails(sessionId,lockscreen).then(responseDate => {
        if(responseDate.isSuccess() && responseDate.data) {
          this.kycSteps = responseDate.data.kycStep;
        }

      });
    },
    setTokens(responseDate: RequestResponse<Jwt, ErrorData<UserServiceErrData>>){
      if (responseDate.isSuccess()) {
        // save tokens to storage
        if(responseDate.data){
          setAuthTokens({
            accessToken: responseDate.data.access_token.token,
            refreshToken: responseDate.data.refresh_token.token
          });
          this.setIsLoggedIn();
        } else {
          //TODO: toast - log in error
        }
      } else {
        //TODO: toast - log in error
      }
    },
    async provideEmailAddress(emailAccount: EmailPairingRequest, onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().initPairEmailKeplr(emailAccount, lockscreen).then(async (responseData) => {
        if (responseData.isSuccess() && responseData.data) {
          await this.signPairingEmail(responseData.data);
          onSuccess();
        } else {
          onFail();
        }
      });
    },
    async signPairingEmail(responseData: EmailPairingRes){
     return await apiFactory.accountApi().sign(useUserStore().connectionInfo, responseData.dataToSign).then(async (signedDataResponse: RequestResponse<string, TxBroadcastError>) => {
       if(signedDataResponse.isSuccess() && signedDataResponse.data){
         await this.approveSignedDataEmail(signedDataResponse.data, responseData.processID);
         return signedDataResponse;
       }else {
         return signedDataResponse.error;
       }
      });
    },
    async approveSignedDataEmail(signedDataResponse: string, processId: string, lockscreen = true) {
      await apiFactory.publicSaleServiceApi().confirmEmailPairingKeplr({processID: processId, signedData:signedDataResponse}, lockscreen).then(res =>{
        this.verificationNeeded = res.isSuccess();
        console.log(res);
      });
    },

    async verifyEmail(processID: string, pairingCode: string, signedData: string, onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().verifyPairingEmailKeplr({pairingCode: pairingCode, processId: processID, signedData: signedData}, true).then(response => {
        if(response.isSuccess()){
          this.setIsLoggedIn();
          this.loginType = LoginTypeEnum.EMAIL;
          this.paired = true;
          this.verificationNeeded = false;
          onSuccess();
        }else {
          onFail();
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
    pairMetamaskAddress: async function(emailAccount: EmailPairingRequest, onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().initPairMetamaskKeplr(emailAccount, lockscreen).then(async responseData => {
        if (responseData.isSuccess() && responseData.data) {
          await this.signPairingMatamaskKeplr(responseData.data, onSuccess, onFail, true);
          // this.setIsLoggedIn();
          // this.loginType = LoginTypeEnum.EMAIL;
          // this.paired = true;
        }
      });
    },
    async signPairingMatamaskKeplr(responseData: EmailPairingRes, onSuccess: (() => void), onFail: (() => void), lockscreen = true){
      let metamaskResp = '';
      let keplrResp = '';
      try{
        await apiFactory.accountApi().sign(useUserStore().connectionInfo, responseData.dataToSign).then(async (signedDataResponse: RequestResponse<string, TxBroadcastError>) => {
          if(signedDataResponse.isSuccess() && signedDataResponse.data){
            keplrResp = signedDataResponse.data
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
            }, true).then((res)=>{
            if(res.isSuccess()){
              this.setIsLoggedIn();
              this.loginType = LoginTypeEnum.METAMASK;
              this.paired = true;
              this.verificationNeeded = false;
            }
          });

        }
      }

    },

    async approveTerms(onSuccess: (() => void), onFail: (() => void), lockscreen = true){
      await apiFactory.publicSaleServiceApi().acceptTerms(true).then(res =>{
        if(res.isSuccess()){
          this.getAccount(onSuccess, onFail, true)
        }
      });

    },
    logOutAccount(){
      clearAuthTokens();
      usePublicSalesStore().logOutAccount();
      this.loginType = LoginTypeEnum.NONE;
      this._isLoggedIn = false;
      this.paired = false;
      this.kycSteps = [];
      this.verificationNeeded = false;
    }
  },
  getters: {
    isLoggedIn():boolean {
      return this._isLoggedIn;
    },
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
        return this.kycSteps.find((step) => step.name == stepName)?.state;
      };
    },
    getKycTierSteps(): (kycTier: KycTierEnum) => KycStepInfo[] {
      return (kycTier ) => {
        if(kycTier == KycTierEnum.TIER_1) {
          return [
            {
              name: KycStepName.IDENTITY,
              state: this.getStepStatus(KycStepName.IDENTITY)
            }];
        } else if(kycTier == KycTierEnum.TIER_2) {
          return [
            {
              name: KycStepName.IDENTITY,
              state: this.getStepStatus(KycStepName.IDENTITY)
            },
            {
              name: KycStepName.LIVENESS,
              state: this.getStepStatus(KycStepName.LIVENESS)
            },
          ];
        } else if(kycTier == KycTierEnum.TIER_3) {
          return [
            {
              name: KycStepName.IDENTITY,
              state: this.getStepStatus(KycStepName.IDENTITY)
            },
            {
              name: KycStepName.LIVENESS,
              state: this.getStepStatus(KycStepName.LIVENESS)
            },
            {
              name: KycStepName.PHONE,
              state: this.getStepStatus(KycStepName.PHONE)
            },
          ];
        }
        return [];
      };
    },
    getKycTier(): KycTierEnum {
      if(this.getStepStatus(KycStepName.IDENTITY) == KycProgressStatus.VALIDATED) {
        if(this.getStepStatus(KycStepName.LIVENESS) == KycProgressStatus.VALIDATED) {
          if(this.getStepStatus(KycStepName.PHONE) == KycProgressStatus.VALIDATED) {
            return KycTierEnum.TIER_3;
          } else {
            return KycTierEnum.TIER_2;
          }
        } else {
          return KycTierEnum.TIER_1;
        }
      }
      return KycTierEnum.TIER_0;
    },
    isVerificationNeeded(): boolean{
      return this.verificationNeeded;
    },
    isTermsAccepted():boolean{
      return this.termsAccepted;
    }
  },
  persist: {
    enabled: true
  }
});

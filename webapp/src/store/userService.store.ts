import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {CreateAccountRequest, PasswordAuthenticateRequest} from "@/models/user/passwordAuth";
import {clearAuthTokens, setAuthTokens} from "axios-jwt";
import {InitWalletAuthRequest, InitWalletAuthResponse, WalletAuthRequest} from "@/models/user/walletAuth";
import {useUserStore} from "@/store/user.store";
import {RequestResponse} from "@/models/request-response";
import {UserServiceErrData} from "@/models/user/userServiceCommons";
import {ErrorData} from "@/api/base.api";
import {Jwt} from "@/models/user/jwt";

interface UserServiceState {
  _isLoggedIn: boolean,
  loginType: LoginTypeEnum,
  kycSessionId: string
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
      kycSessionId: ''
    };
  },
  actions: {
    setIsLoggedIn() {
      this._isLoggedIn = true;
    },
    async authWalletInit(initWalletAuthRequest: InitWalletAuthRequest,onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
       const initWalletAuthResponse = await apiFactory.userServiceApi().authWalletInit(initWalletAuthRequest, lockscreen);
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
      const initWalletAuthResponse = await apiFactory.userServiceApi().authWalletInit(initWalletAuthRequest, lockscreen);
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
      return await apiFactory.userServiceApi().createEmailAccount(createAccountRequest, lockscreen).then(res => {
        if(res.isSuccess()) {
          onSuccess();
        } else {
          onFail();
        }
      });
    },
    async authWalletKeplr(walletAuthData: WalletAuthRequest, onSuccess: (() => void), onFail: (() => void), lockscreen = true, ) {
      return await apiFactory.userServiceApi().authWalletKeplr(walletAuthData, lockscreen).then(responseDate => {
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
      await apiFactory.userServiceApi().authWalletMetamask(walletAuthData, lockscreen).then(responseDate => {
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
      await apiFactory.userServiceApi().authEmailAccount(emailAccount, lockscreen).then(responseDate => {
        if(responseDate.isSuccess()) {
          this.setTokens(responseDate);
          this.loginType = LoginTypeEnum.EMAIL;
          onSuccess();
        } else {
          onFail();
        }

      });
    },
    async activateEmailAccount(code: string, lockscreen = true) {
      await apiFactory.userServiceApi().activateEmailAccount(code, lockscreen).then(responseDate => {
        this.setTokens(responseDate);
      });
    },
    async initKycSession(lockscreen = true) {
      await apiFactory.userServiceApi().initKycSession(lockscreen).then(responseDate => {
        console.log(responseDate);
        if(responseDate.isSuccess() && responseDate.data) {
          this.kycSessionId = responseDate.data.session_id;
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
    logOutAccount(){
      clearAuthTokens();
      this.loginType = LoginTypeEnum.NONE;
    }
  },
  getters: {
    getKycSessionId(): string {
      return this.kycSessionId;
    }
  },
  persist: {
    enabled: true
  }
});

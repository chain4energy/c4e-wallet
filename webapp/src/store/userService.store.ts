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
import axios from "axios";
import { EmailPairingRequest } from "@/models/user/emailPairing";

interface UserServiceState {
  _isLoggedIn: boolean,
  loginType: LoginTypeEnum,
  paired: boolean,
  userEmail: string | undefined,
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
      paired: false,
      userEmail: undefined
    };
  },
  actions: {
    setIsLoggedIn() {
      this._isLoggedIn = true;
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
    async activateEmailAccount(code: string, lockscreen = true) {
      await apiFactory.publicSaleServiceApi().activateEmailAccount(code, lockscreen).then(responseDate => {
        this.setTokens(responseDate);
        this.loginType = LoginTypeEnum.EMAIL;
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
      await apiFactory.publicSaleServiceApi().pairEmail(emailAccount, lockscreen).then(responseDate => {
        if(responseDate.isSuccess()) {
          this.setIsLoggedIn();
          this.loginType = LoginTypeEnum.EMAIL;
          this.paired = true;
          onSuccess();
        } else {
          onFail();
        }
      });
    },
    logOutAccount(){
      clearAuthTokens();
      this.loginType = LoginTypeEnum.NONE;
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
    }
  },
  persist: {
    enabled: true
  }
});

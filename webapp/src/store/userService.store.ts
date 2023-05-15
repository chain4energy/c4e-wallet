import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {CreateAccountRequest, PasswordAuthenticateRequest} from "@/models/user/passwordAuth";
import {clearAuthTokens, setAuthTokens} from "axios-jwt";
import {InitWalletAuthRequest, InitWalletAuthResponse, WalletAuthRequest} from "@/models/user/walletAuth";
import {useUserStore} from "@/store/user.store";

interface UserServiceState {
  nothing: string//TODO: remove
}

export const useUserServiceStore = defineStore({
  id: 'userServiceStore',
  state: (): UserServiceState => {
    return {
      nothing: ''
    };
  },
  actions: {
    async authWalletInit(initWalletAuthRequest: InitWalletAuthRequest, lockscreen = true) {
       const initWalletAuthResponse = await apiFactory.userServiceApi().authWalletInit(initWalletAuthRequest, lockscreen);
       if(initWalletAuthResponse.isSuccess() && initWalletAuthResponse.data) {
         await apiFactory.accountApi().sign(useUserStore().connectionInfo, initWalletAuthResponse.data.dataToSign).then(signedDataResponse => {
           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
           // @ts-ignore
           this.authWalletKeplr({processID: initWalletAuthResponse.data.processID, signedData: signedDataResponse.data});
         });
       }
    },
    async authMetamaskWalletInit(initWalletAuthRequest: InitWalletAuthRequest, lockscreen = true) {
      const initWalletAuthResponse = await apiFactory.userServiceApi().authWalletInit(initWalletAuthRequest, lockscreen);
      if(initWalletAuthResponse.isSuccess() && initWalletAuthResponse.data) {
        await apiFactory.accountApi().signMetamask(initWalletAuthResponse.data.dataToSign).then(signedDataResponse => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.authWalletMetamask({processID: initWalletAuthResponse.data.processID, signedData: signedDataResponse.data});
        });
      }
    },
    async createEmailAccount(createAccountRequest: CreateAccountRequest, onSuccess: (() => void), lockscreen = true) {
      return await apiFactory.userServiceApi().createEmailAccount(createAccountRequest, lockscreen).then(res => {
        if(res.isSuccess()) {
          onSuccess();
        }
      });
    },
    async authWalletKeplr(walletAuthData: WalletAuthRequest, lockscreen = true) {
      await apiFactory.userServiceApi().authWalletKeplr(walletAuthData, lockscreen).then(responseDate => {
        if (responseDate.isSuccess()) {
          // save tokens to storage
          if(responseDate.data){
            setAuthTokens({
              accessToken: responseDate.data.access_token.token,
              refreshToken: responseDate.data.refresh_token.token
            });
          } else {
            //TODO: toast - log in error
          }
        } else {
          //TODO: toast - log in error
        }
      });
    },
    async authWalletMetamask(walletAuthData: WalletAuthRequest, lockscreen = true) {
      await apiFactory.userServiceApi().authWalletMetamask(walletAuthData, lockscreen).then(responseDate => {
        if (responseDate.isSuccess()) {
          // save tokens to storage
          if(responseDate.data){
            setAuthTokens({
              accessToken: responseDate.data.access_token.token,
              refreshToken: responseDate.data.refresh_token.token
            });
          } else {
            //TODO: toast - log in error
          }
        } else {
          //TODO: toast - log in error
        }
      });
    },
    async authEmailAccount(emailAccount: PasswordAuthenticateRequest, lockscreen = true) {
      await apiFactory.userServiceApi().authEmailAccount(emailAccount, lockscreen).then(responseDate => {
        if (responseDate.isSuccess()) {
          // save tokens to storage
          if(responseDate.data){
            setAuthTokens({
              accessToken: responseDate.data.access_token.token,
              refreshToken: responseDate.data.refresh_token.token
            });
          } else {
            //TODO: toast - log in error
          }
        } else {
          //TODO: toast - log in error
        }
      });
    },
    async activateEmailAccount(code: string, lockscreen = true) {
      await apiFactory.userServiceApi().activateEmailAccount(code, lockscreen).then(responseDate => {
        if (responseDate.isSuccess()) {
          // save tokens to storage
          if(responseDate.data){
            setAuthTokens({
              accessToken: responseDate.data.access_token.token,
              refreshToken: responseDate.data.refresh_token.token
            });
          } else {
            //TODO: toast - log in error
          }
        } else {
          //TODO: toast - log in error
        }
      });
    },
    logOutAccount(){
      clearAuthTokens();
    }
  },
  getters: {}
});

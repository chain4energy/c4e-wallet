import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {CreateAccountRequest, PasswordAuthenticateRequest} from "@/models/user/passwordAuth";
import {clearAuthTokens, setAuthTokens} from "axios-jwt";
import {InitWalletAuthRequest} from "@/models/user/walletAuth";
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
      return await apiFactory.userServiceApi().authWalletInit(initWalletAuthRequest, lockscreen).then(res => {

        const connectionInfo = useUserStore().connectionInfo;
        apiFactory.accountApi().sign(connectionInfo, res.data?.dataToSign);
      });
    },
    async createEmailAccount(createAccountRequest: CreateAccountRequest, lockscreen = true) {
      return await apiFactory.userServiceApi().createEmailAccount(createAccountRequest, lockscreen).then();
    },
    async authEmailAccount(emailAccount: PasswordAuthenticateRequest, lockscreen = true) {
      await apiFactory.userServiceApi().authEmailAccount(emailAccount, lockscreen).then(responseDate => {
        if (responseDate.isSuccess()) {
          // save tokens to storage
          if(responseDate.data){
            setAuthTokens({
              accessToken: responseDate.data.access_token.id,
              refreshToken: responseDate.data.refresh_token.id
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

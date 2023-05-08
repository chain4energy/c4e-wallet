import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {EmailAccount} from "@/models/user/emailAccount";
import {clearAuthTokens, setAuthTokens} from "axios-jwt";

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
    async createEmailAccount(emailAccount: EmailAccount, lockscreen = true) {
      return await apiFactory.userServiceApi().createEmailAccount(emailAccount, lockscreen).then();
    },
    async authEmailAccount(emailAccount: EmailAccount, lockscreen = true) {
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

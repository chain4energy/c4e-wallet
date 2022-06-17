import { defineStore } from 'pinia';
import { Account } from "@/models/account";
import apiFactory from "@/api/factory.api";
// import { RoleEnum } from '@/services/permissions/role-enum';
// import {TokenObject} from "@/models/token-object";

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => {
    return {
      account: Object(Account),
      _isLoggedIn: false
    };
  },
  actions: {
    async fetchAccount(id: string) {
      await apiFactory.accountApi().fetchAccount(id).then(response => {
        if (response.error == null && response.data != undefined) {
          this.account = response.data.account;
          this._isLoggedIn = true;
        } else {
          this._isLoggedIn = false;
        }

      });
    },
  },
  getters: {
    isLoggedIn (): boolean {
       return this._isLoggedIn;
    },
    getAccount(): Account{
      return this.account;
    },
  },
  // persist: {
  //   enabled: true
  // }
});

// function decodeToken (accessToken: string) : any {
//   const base64Url = accessToken.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
//     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join(''));
//   return JSON.parse(jsonPayload);
// }

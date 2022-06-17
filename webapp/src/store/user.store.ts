import { defineStore } from 'pinia';
// import { RoleEnum } from '@/services/permissions/role-enum';
// import {TokenObject} from "@/models/token-object";

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => {
    return {
      _isLoggedIn: false
    };
  },
  actions: {
    setIsLoggedIn () {
      this._isLoggedIn = true;
    },
    loggedOut () {
      this._isLoggedIn = false;
    },
  },
  getters: {
    isLoggedIn (): boolean {
       return this._isLoggedIn;
    }
  },
  persist: {
    enabled: true
  }
});

// function decodeToken (accessToken: string) : any {
//   const base64Url = accessToken.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
//     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join(''));
//   return JSON.parse(jsonPayload);
// }

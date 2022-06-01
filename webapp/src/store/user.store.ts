import { defineStore } from 'pinia';
// import { RoleEnum } from '@/services/permissions/role-enum';
// import {TokenObject} from "@/models/token-object";

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => {
    return {
      // accessTokenObject: Object(TokenObject),
      // refreshTokenObject: Object(TokenObject),
      _isLoggedIn: false
    };
  },
  actions: {
    // setAccessToken (accessToken: TokenObject) {
    //   this.accessTokenObject = accessToken;
    // },
    // setRefreshToken (refreshToken: TokenObject) {
    //   this.refreshTokenObject = refreshToken;
    // },
    setIsLoggedIn () {
      this._isLoggedIn = true;
    },
    loggedOut () {
      this._isLoggedIn = false;
      // this.accessTokenObject = null;
      // this.refreshTokenObject = null;
    },
    // getCurrentRole (): RoleEnum{
    //     const role = decodeToken(this.accessTokenObject.token).role as string;
    //     return RoleEnum[role as keyof typeof RoleEnum];
    //
    // },
    // getProviderId () {
    //   return decodeToken(this.accessTokenObject.token).providerId as string;
    // }
    // getAccessToken (): string {
    //   return this.accessToken;
    // }
  },
  getters: {
    // accessToken (): string {
    //   return this.accessTokenObject.token;
    // },
    // refreshToken (): string {
    //   return this.refreshTokenObject.token;
    // },
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

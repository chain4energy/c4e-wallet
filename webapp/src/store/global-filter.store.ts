import { defineStore } from 'pinia';
// import {UsersHolder} from "@/models/users-holder";
// import {User} from "@/models/user";

export const useGlobalFilterStore = defineStore({
  id: 'globalFilterStore',
  state: () => {
    return {
      filter : '',
      isLoading : false
    };
  },
  actions: {
    setFilter (filter:  string) {
      this.filter = filter;
    },
    setIsLoading (isLoading:  boolean) {
      this.isLoading = isLoading;
    },
    clearFilter(){
      this.filter = '';
    }
  },
  getters: {
    getFilter ():string {
      return this.filter;
    }
  }
});

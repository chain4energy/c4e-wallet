import { defineStore } from 'pinia';
// import {UsersHolder} from "@/models/users-holder";
// import {User} from "@/models/user";

interface GlobalFilterState {
  filter: string
  isLoading: boolean
}

export const useGlobalFilterStore = defineStore({
  id: 'globalFilterStore',
  state: (): GlobalFilterState => {
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

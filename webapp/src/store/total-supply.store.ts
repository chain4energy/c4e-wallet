import {defineStore} from "pinia";
import {Pool} from "@/models/pool";

export const useTotalSupplyStore = defineStore({
  id: 'totalSupplyStore',
  state: () => {
    return {
      totalSupply: Object(Pool),
    };
  },
  actions: {
    setTotalSupply(totalSupply:  Pool) {
      this.totalSupply=totalSupply;
    },
  },
  getters: {

    getTotalSupply(): Pool {
      return this.totalSupply;
    },

  }
});

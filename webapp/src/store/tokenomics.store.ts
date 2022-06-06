import {defineStore} from "pinia";
import {Tokenomics} from "@/models/tokenomics";

export const useTokenomicsStore = defineStore({

  id: 'tokenomicsStore',
  state: () => {
    return {
      tokenomics: Object(Tokenomics),
    };
  },
  actions: {
    setTokenomics(tokenomics:  Tokenomics) {
      this.tokenomics=tokenomics;
    },
  },
  getters: {

    getTokenomics(): Tokenomics {
      return this.tokenomics;
    },

  }
});

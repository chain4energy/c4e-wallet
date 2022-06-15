import {defineStore} from "pinia";
import {Tokenomics, Pool} from "@/models/tokenomics";
import apiFactory from "@/api/factory.api";


export const useTokenomicsStore = defineStore({

  id: 'tokenomicsStore',
  state: () => {
    return {
      tokenomics: Object() as Tokenomics,
    };
  },
  actions: {
    fetchTokenomics() {
      apiFactory.tokenomicsApi().fetchTokenomics().then( response => {
        if (response.error == null && response.data != undefined) {
          const pool:Pool = response.data;
          this.tokenomics = pool.pool;
        } else {
          //TODO: error handling
        }
      });
    },

  },
  getters: {

    getTokenomics(): Tokenomics {
      return this.tokenomics;
    },

  }
});

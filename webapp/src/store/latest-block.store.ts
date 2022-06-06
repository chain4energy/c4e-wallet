import {defineStore} from "pinia";

export const useLatestBlockStore = defineStore({
  id: 'latestBlockStore',
  state: () => {
    return {
      latestBlock: Object(Number),
    };
  },
  actions: {
    setLatestBlock(latestBlock:  number) {
      this.latestBlock=latestBlock;
    },
  },
  getters: {

    getLatestBlock(): number {
      return this.latestBlock;
    },

  }
});

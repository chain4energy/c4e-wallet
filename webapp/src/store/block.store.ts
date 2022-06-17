import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {LatestBlock} from "@/models/LatestBlock";

export const useBlockStore = defineStore( 'block', {
  state: () => {
    return {
      averageBlockTime: Object(Number),
      latestBlockHeight: Object(Number)
    };
  },
  actions: {
    fetchLatestBlock() {
      apiFactory.blockApi().fetchLatestBlock().then(response => {

        if (response.error == null && response.data != undefined) {

          const latestBlock: LatestBlock = response.data;

          this.latestBlockHeight = latestBlock.block.header.height;

        } else {
          //TODO: error handling
        }

      });
    },
    fetchAverageBlockTime() {
      apiFactory.blockApi().fetchAverageBlockTime().then(response => {

        if (response.error == null && response.data != undefined) {
          this.averageBlockTime = response.data.data.averageBlockTime[0].averageTime;

        } else {
          //TODO: error handling
        }

      });
    }
  },
  getters: {
    getLatestBlockHeight(): number {
      return this.latestBlockHeight;
    },
      getAverageBlockTime(): number {
      return this.averageBlockTime;
    }
  }
});

import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {LatestBlock} from "@/models/LatestBlock";
import { useUserStore } from "@/store/user.store";

interface BlockState {
  averageBlockTime: number
  latestBlockHeight: number
  latestBlockTime: string
  latestBlock: LatestBlock
}

export const useBlockStore = defineStore( 'block', {
  state: (): BlockState => {
    return {
      averageBlockTime: Object(String),
      latestBlockHeight: Object(Number),
      latestBlockTime: Object(String),
      latestBlock: Object() as LatestBlock,
    };
  },
  actions: {
    fetchLatestBlock() {
      apiFactory.blockApi().fetchLatestBlock().then(response => {

        if (response.error == null && response.data != undefined) {

          const latestBlock: LatestBlock = response.data;

          this.latestBlockHeight = latestBlock.block.header.height;

          this.latestBlockTime = latestBlock.block.header.time;

          this.latestBlock = latestBlock

          if(useUserStore().getAccount
            && useUserStore().isContinuousVestingAccount){
            useUserStore().calculateVestingLocked(latestBlock.block.header.time)
          }


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
    },
    getLatestBlock(): any{
      return this.latestBlock
    }
  }
});

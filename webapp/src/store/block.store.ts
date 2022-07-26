import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import { useUserStore } from "@/store/user.store";
import { Block } from "@/models/store/block";
import { useToast } from "vue-toastification";
import { StoreLogger } from "@/services/logged.service";
import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { LogLevel } from "@/services/logger/log-level";

const toast = useToast();
const logger = new StoreLogger(ServiceTypeEnum.BLOCK_STORE);

interface BlockState {
  averageBlockTime: number
  latestBlock: Block
}

export const useBlockStore = defineStore( 'block', {
  state: (): BlockState => {
    return {
      averageBlockTime: Number.NaN,
      latestBlock: new Block(0, new Date(0)),
    };
  },
  actions: {
    async fetchLatestBlock(lockscreen = true) {
      await apiFactory.blockApi().fetchLatestBlock(lockscreen).then(response => {

        if (response.isSuccess() && response.data !== undefined) {
          this.latestBlock = response.data;
          useUserStore().calculateVestingLocked(this.getLatestBlock.time);
        } else {
          const message = 'Error fetching latest block data';
          logger.logToConsole(LogLevel.ERROR, message);
          toast.error(message);
        }

      });
    },
    async fetchAverageBlockTime(lockscreen = true) {
      await apiFactory.blockApi().fetchAverageBlockTime(lockscreen).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.averageBlockTime = response.data.data.averageBlockTime[0].averageTime;
        } else {
          const message = 'Error fetching avarage block time data';
          logger.logToConsole(LogLevel.ERROR, message);
          toast.error(message);
        }

      });
    },
    clear() {
      this.averageBlockTime = Number.NaN;
      this.latestBlock = new Block(0, new Date(0));
    }
  },
  getters: {
    getLatestBlockHeight(): number {
      return this.latestBlock.height;
    },
    getAverageBlockTime(): number {
      return this.averageBlockTime;
    },
    getLatestBlock(): Block{
      return this.latestBlock;
    }
  }
});

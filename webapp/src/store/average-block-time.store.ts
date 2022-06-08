import {defineStore} from "pinia";

export const useAverageBlockTime = defineStore({

  id: 'averageBlockTime',
  state: () => {
    return {
      averageBlockTime: Object(Number),
    };
  },
  actions: {
    setAverageBlockTime(averageBlockTime:  number) {
      this.averageBlockTime=averageBlockTime;
    },
  },
  getters: {

    getAverageBlockTime(): number {
      return this.averageBlockTime;
    },
  }
});

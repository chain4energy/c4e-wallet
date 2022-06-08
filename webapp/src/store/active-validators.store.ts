import {defineStore} from "pinia";

export const useActiveValidatorsStore = defineStore({

  id: 'activeValidatorsStore',
  state: () => {
    return {
      numberOfActiveValidators: Object(Number),
    };
  },
  actions: {
    setNumberOfActiveValidators(numberOfActiveValidators:  number) {
      this.numberOfActiveValidators=numberOfActiveValidators;
    },
  },
  getters: {

    getActiveValidators(): number {
      return this.numberOfActiveValidators;
    },
  }
});

import {defineStore} from "pinia";

export const useTallyingStore = defineStore({
  id: 'tallyingStore',
  state: () => {
    return {
      tally_params: Object,
    };
  },
  actions: {
    setTallyParams(tallyParams:  any) {
      this.tally_params=tallyParams;
    },
  },
  getters: {
    getTallyParams(): any {
      return this.tally_params;
    },
  }
});

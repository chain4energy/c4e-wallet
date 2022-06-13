import {defineStore} from "pinia";

export const useProposalStore = defineStore({
  id: 'proposalStore',
  state: () => {
    return {
      proposals: Object(Array),
    };
  },
  actions: {
    setProposals(proposals:  any) {
      this.proposals = proposals;
    },
  },
  getters: {

    getProposals(): any {
      return this.proposals;
    },
  }
});

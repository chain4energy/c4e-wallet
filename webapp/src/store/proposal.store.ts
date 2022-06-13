import {defineStore} from "pinia";

export const useProposalStore = defineStore({
  id: 'proposalStore',
  state: () => {

    return {
      proposals: [],
    };
  },
  actions: {
    setProposals(proposals:  any) {

      this.proposals = this.proposals.concat(proposals);
      console.log(this.proposals)
    },
    deleteProposals() {
      this.proposals = [];
    }
  },
  getters: {

    getProposals(): any {
      return this.proposals;
    },
  }
});

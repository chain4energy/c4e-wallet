import {defineStore} from "pinia";

export const useProposalStore = defineStore({
  id: 'proposalStore',
  state: () => {

    return {
      proposals: [],
      paginationKey: ''
    };
  },
  actions: {
    setProposals(proposals:  any, paginationKey: string) {
      console.log(proposals)
      this.paginationKey = paginationKey;
      this.proposals = this.proposals.concat(proposals);
    },
    deleteProposals() {
      this.proposals = [];
    }
  },
  getters: {

    getProposals(): any {
      return this.proposals;
    },
    getPaginationKey(): string {
      return this.paginationKey;
    }
  }
});

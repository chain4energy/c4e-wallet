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
      this.proposals=proposals;
    },
  },
  getters: {

    getProposals(): any {
      return this.proposals;
    },
    getProposalById: (state): any => {
      return (proposalId:any) => state.proposals.find((proposal:any) => proposal.proposal_id === proposalId);
    }
  }
});

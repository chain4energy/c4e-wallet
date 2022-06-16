import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {DataHolder} from "@/models/data-holder";
import {Proposal} from "@/models/Proposal";
import {TallyParams} from "@/models/GovernanceParameters";

export const useProposalsStore = defineStore({
  id: 'proposalsStore',
  state: () => {

    return {
      proposals: new DataHolder<Proposal>(),
      proposal: Object(),
      paginationKey: '',
      tallyParams: new TallyParams()
    };
  },
  actions: {
    fetchProposals() {
      apiFactory.proposalsApi().fetchProposals(this.paginationKey).then(response => {

        if (response.error == null && response.data != undefined) {
          const dataHolder = new DataHolder<Proposal>();

          dataHolder.elements = this.proposals.elements.concat(response.data.proposals);
          dataHolder.amount += Number(response.data.pagination.total);
          this.paginationKey = response.data.pagination.next_key;
          this.proposals = dataHolder;

        } else {
          //TODO: error handling
        }

      });
    },
    async fetchProposalById(proposalId: string) {
      await apiFactory.proposalsApi().fetchProposalById(proposalId).then(response => {
        if (response.error == null && response.data != undefined) {
          this.proposal = response.data.proposal;
        } else {
          //TODO: error handling
        }

      });
    },
    async fetchTallyParams() {
      await apiFactory.proposalsApi().fetchTallyParams().then(response => {
        if (response.error == null && response.data != undefined) {
          this.tallyParams = response.data.tally_params;
        } else {
          //TODO: error handling
        }
      });
    }
  },
  getters: {

    getProposals(): DataHolder<Proposal> {
      return this.proposals;
    },
    getPaginationKey(): string {
      return this.paginationKey;
    },
    getProposal(): Proposal {
      return this.proposal;
    },
    getTallyParams(): TallyParams {
      return this.tallyParams;
    }
  }
});

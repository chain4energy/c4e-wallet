import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {DataHolder} from "@/models/data-holder";
import {Proposal} from "@/models/store/proposal";
import {TallyParams} from "@/models/GovernanceParameters";

interface ProposalsState {
  proposals: Proposal[]
  numberOfActiveProposals: number
  proposal: Proposal | undefined
  tallyParams: any
}

export const useProposalsStore = defineStore({
  id: 'proposalsStore',
  state: (): ProposalsState => {

    return {
      proposals: Array<Proposal>(),
      numberOfActiveProposals: 0,
      //proposals: new DataHolder<Proposal>(),
      proposal: Object() as Proposal,
      //paginationKey: '',
      tallyParams: new TallyParams()
    };
  },
  actions: {

    async fetchProposals(){
      await apiFactory.proposalsApi().fetchProposals()
        .then((resp) => {
          if (resp.isSuccess() && resp.data !== undefined){
            this.proposals = resp.data.proposals;
            this.numberOfActiveProposals = resp.data.numberOfActive;
          } else {
            const message = 'Error fetching proposals data';
          }
        });
    },
    async fetchProposalById(id: number){
      await apiFactory.proposalsApi().fetchProposalById(id).then((resp) => {
          if (resp.isSuccess() && resp.data !== undefined){
            this.proposal = resp.data.proposal;
          } else {
            const message = 'Error fetching proposal data';
          }
      })
    },

    //fetchProposals() {
      //apiFactory.proposalsApi().fetchProposals(this.paginationKey).then(response => {

       // if (response.error == null && response.data != undefined) {
         // const dataHolder = new DataHolder<Proposal>();

        //  dataHolder.elements = this.proposals.elements.concat(response.data.proposals);
       //   dataHolder.amount += Number(response.data.pagination.total);
       //   this.paginationKey = response.data.pagination.next_key;
       //   this.proposals = dataHolder;

       // } else {
          //TODO: error handling
       // }

      //});
   // },
   // async fetchProposalById(proposalId: string) {
   //   await apiFactory.proposalsApi().fetchProposalById(proposalId).then(response => {
   //     if (response.error == null && response.data != undefined) {
   //       this.proposal = response.data.proposal;
    //    } else {
   //       //TODO: error handling
   //     }
//
   //   });
   // },
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

    getProposals(): Proposal[] {
      return this.proposals;
    },
  //  getPaginationKey(): string {
  //    return this.paginationKey;
  //  },
    getProposal(): Proposal | undefined {
      return this.proposal;
    },
    getTallyParams(): TallyParams {
      return this.tallyParams;
    }
  }
});

import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {Proposal, TallyParams} from "@/models/store/proposal";
import { useToast} from "vue-toastification";

const toast = useToast()

interface ProposalsState {
  proposals: Proposal[]
  proposalById: Map<number, number>
  numberOfActiveProposals: number
  proposal: Proposal | undefined
  paginationKey: string | null
  tallyParams: TallyParams
}

export const useProposalsStore = defineStore({
  id: 'proposalsStore',
  state: (): ProposalsState => {

    return {
      proposals: Array<Proposal>(),
      numberOfActiveProposals: 0,
      proposalById: new Map<number, number>(),
      //proposals: new DataHolder<Proposal>(),
      proposal: undefined,
      paginationKey: null,
      tallyParams: new TallyParams(Number.NaN, Number.NaN, Number.NaN)
    };
  },
  actions: {

    async fetchProposals(lockscreen = true){
      await apiFactory.proposalsApi().fetchProposals(this.paginationKey, lockscreen)
        .then((resp) => {
          if (resp.response.isSuccess() && resp.response.data !== undefined){
            this.proposals = this.proposals.concat(resp.response.data.proposals);
            const mappedIndexes = new Map<number, number>();

            this.proposals.forEach((el,index) => {
              mappedIndexes.set(el.proposalId,index);
            });
            this.proposalById = mappedIndexes;
            this.numberOfActiveProposals = resp.response.data.numberOfActive;
            this.paginationKey = resp.nextKey;
          } else {
            const message = 'Error fetching proposals data';
            toast.error(message);
          }
        });
    },
    async fetchProposalById(id: number, lockscreen = true){
      const index = this.proposalById.get(id);
      if(index){
       this.proposal= this.proposals[index];
      } else {
        await apiFactory.proposalsApi().fetchProposalById(id, lockscreen).then((resp) => {
          if (resp.isSuccess() && resp.data !== undefined){
            this.proposal = resp.data.proposal;
          } else {
            const message = 'Error fetching proposal data';
            toast.error(message);
          }
        });
      }
    },
    async setProposalFromLocal(proposal: Proposal){
      this.proposal = proposal;
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
    async fetchTallyParams(lockscreen = true) {
      await apiFactory.proposalsApi().fetchTallyParams(lockscreen).then(response => {
       if (response.error == null && response.data != undefined) {
        this.tallyParams = response.data;
       } else {
          //TODO: error handling
        }
      });
    },
    clearProposals() {
      this.proposals = Array<Proposal>();
      this.numberOfActiveProposals = 0;
      this.proposal = Object();
      this.paginationKey = null;
    },
    clear() {
      this.clearProposals();
      this.tallyParams = new TallyParams(Number.NaN, Number.NaN, Number.NaN);
    }
  },
  getters: {

    getProposals(): Proposal[] {
      return this.proposals;
    },
   getPaginationKey(): string | null {
     return this.paginationKey;
   },
    getProposal(): Proposal | undefined {
      return this.proposal;
    },
    getTallyParams(): TallyParams {
      return this.tallyParams;
    }
  }
});

import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {Proposal, ProposalDetailsTally, ProposalTallyResult, TallyParams, VoteOption} from "@/models/store/proposal";
import { useToast} from "vue-toastification";
import { Coin } from "@/models/store/common";
import { useConfigurationStore } from "./configuration.store";
import { StoreLogger } from "@/services/logged.service";
import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { LogLevel } from "@/services/logger/log-level";
import { useUserStore } from "./user.store";

const toast = useToast();
const logger = new StoreLogger(ServiceTypeEnum.PROPOSAL_STORE);

interface ProposalsState {
  proposals: Proposal[]
  proposalById: Map<number, number>
  proposalsTally: Map<number, ProposalTallyResult>
  numberOfActiveProposals: number
  proposal: Proposal | undefined
  proposalTally: ProposalTallyResult | undefined
  paginationKey: string | null
  tallyParams: TallyParams,
  minDeposit: Coin,
  userVote: VoteOption | null;
  proposalDetailsTally: ProposalDetailsTally | undefined;
  proposalDetailsTallyMap: Map<number,ProposalDetailsTally>;
}

export const useProposalsStore = defineStore({
  id: 'proposalsStore',
  state: (): ProposalsState => {

    return {
      proposals: Array<Proposal>(),
      numberOfActiveProposals: 0,
      proposalById: new Map<number, number>(),
      proposalsTally: new Map<number, ProposalTallyResult>(),
      proposal: undefined,
      proposalTally: undefined,
      paginationKey: null,
      tallyParams: new TallyParams(Number.NaN, Number.NaN, Number.NaN),
      minDeposit: new Coin(0n, useConfigurationStore().config.stakingDenom),
      userVote: null,
      proposalDetailsTally: undefined,
      proposalDetailsTallyMap: new Map<number, ProposalDetailsTally>()
    };
  },
  actions: {

    async fetchProposals(lockscreen = true){
      logger.logToConsole(LogLevel.INFO, 'fetchVotingProposalTallyResult');
      await apiFactory.proposalsApi().fetchProposals(this.paginationKey, lockscreen)
        .then(async (resp) => {
          if (resp.response.isSuccess() && resp.response.data !== undefined){
            const proposalsIds: number[] = [];
            resp.response.data.proposals.forEach(proposal => {
              proposalsIds.push(proposal.proposalId);
            });

            this.proposals = this.proposals.concat(resp.response.data.proposals);
            const mappedIndexes = new Map<number, number>();
            const tallys = Array<Promise<void>>();

            this.proposals.forEach((el,index) => {
              mappedIndexes.set(el.proposalId,index);
              this.proposalsTally.delete(el.proposalId);
              if (el.isVotingPeriod()) {
                tallys.push(this.fetchVotingProposalTallyResult(el.proposalId, false, lockscreen));
              }
            });
            tallys.push(this.fetchProposalsDetailsTallyList(proposalsIds, lockscreen));
            this.proposalById = mappedIndexes;
            this.numberOfActiveProposals = resp.response.data.numberOfActive;
            this.paginationKey = resp.nextKey;
            if (tallys.length > 0) {
              await Promise.all(tallys);
            }
          } else {
            const message = 'Error fetching proposals data';
            logger.logToConsole(LogLevel.ERROR, message);
            toast.error(message);
          }
        });
    },
    async fetchProposalById(
      id: number,
      onSuccess: (() => void) | undefined = undefined,
      onError: (() => void) | undefined = undefined,
      lockscreen = true,
      forceRemoteFetch = false
    ){
      logger.logToConsole(LogLevel.INFO, 'fetchProposalById ');

      const remoteFetch = async () => {
        await apiFactory.proposalsApi().fetchProposalById(id, lockscreen).then(async (resp) => {
          if (resp.isSuccess() && resp.data !== undefined){
            this.proposal = resp.data.proposal;
            if(this.proposals.length<0){
              this.proposals.push(this.proposal);
            }
            const promises = Array<Promise<void>>();
            if (useUserStore().isLoggedIn) {
              logger.logToConsole(LogLevel.DEBUG, 'fetchProposalById ', String(useUserStore().isLoggedIn));
              promises.push(this.fetchProposalUserVote(id, useUserStore().getAccount.address));
            }
            this.proposalTally = undefined;
            logger.logToConsole(LogLevel.DEBUG, 'fetchProposalById isVotingPeriod ', String(resp.data.proposal.isVotingPeriod()));
            if (resp.data.proposal.isVotingPeriod()) {
              promises.push(this.fetchVotingProposalTallyResult(id, true, lockscreen));
            }
            if (promises.length > 0) {
              await Promise.all(promises);
            }
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const message = 'Error fetching proposal data';
            logger.logToConsole(LogLevel.ERROR, message);
            toast.error(message);
            if (onError) {
              onError();
            }
          }
        });
      };
      if (forceRemoteFetch) {
        return await remoteFetch();
      }
      const proposal = this.getProposalById(id);
      if(proposal !== undefined) {

        const promises = Array<Promise<void>>();

        if (useUserStore().isLoggedIn) {
          promises.push(this.fetchProposalUserVote(id, useUserStore().getAccount.address));
        }

        this.proposalTally = undefined;
        if (proposal.isVotingPeriod()) {
          const tally = this.proposalsTally.get(proposal.proposalId);
          logger.logToConsole(LogLevel.INFO, 'tally ' + tally?.yes);

          if (!tally) {
            promises.push(this.fetchVotingProposalTallyResult(id, true, lockscreen));
          } else {
            this.proposalTally = tally;
          }
        }
        if (promises.length > 0) {
          await Promise.all(promises);
        }
        this.proposal = proposal;
        if (onSuccess) {
          onSuccess();
        }
      } else {
        await remoteFetch();
      }
    },

    async fetchVotingProposalTallyResult(id: number, storeSingle: boolean, lockscreen = true) {
      logger.logToConsole(LogLevel.INFO, 'fetchVotingProposalTallyResult');
      await apiFactory.proposalsApi().fetchVotingProposalTallyResult(id, lockscreen).then((resp) => {
        if (resp.isSuccess() && resp.data !== undefined){
          if (storeSingle) {
            this.proposalTally = resp.data;
            this.proposalsTally.set(id, resp.data);
            logger.logToConsole(LogLevel.INFO, 'fetchVotingProposalTallyResult: ', String(this.proposalTally.yes));
            logger.logToConsole(LogLevel.INFO, 'fetchVotingProposalTallyResult: ', String(this.proposalTally.abstain));
            logger.logToConsole(LogLevel.INFO, 'fetchVotingProposalTallyResult: ', String(this.proposalTally.no));
            logger.logToConsole(LogLevel.INFO, 'fetchVotingProposalTallyResult: ', String(this.proposalTally.noWithVeto));


          } else {
            this.proposalsTally.set(id, resp.data);
          }
        } else {
          const message = 'Error fetching proposal tally data';
          logger.logToConsole(LogLevel.ERROR, message);
          toast.error(message);
        }
      });
    },

    async fetchProposalUserVote(id: number, voter: string, lockscreen = true) {
      logger.logToConsole(LogLevel.INFO, 'fetchProposalUserVote');
      await apiFactory.proposalsApi().fetchProposalVote(id, voter, lockscreen).then((resp) => {
        if (resp.isSuccess() && resp.data !== undefined){
          this.userVote = resp.data;
        } else {
          const message = 'Error fetching proposal user vote';
          logger.logToConsole(LogLevel.ERROR, message);
          toast.error(message);
        }
      });
    },

    async fetchTallyParams(lockscreen = true) {
      await apiFactory.proposalsApi().fetchTallyParams(lockscreen).then(response => {
       if (response.error == null && response.data != undefined) {
        this.tallyParams = response.data;
       } else {
        const message = 'Error fetching tally params data';
        logger.logToConsole(LogLevel.ERROR, message);
        toast.error(message);
        }
      });
    },
    async fetchDepositParams(lockscreen = true) {
      await apiFactory.proposalsApi().fetchDepositParams(lockscreen).then(response => {
       if (response.error == null && response.data != undefined) {
        this.minDeposit = response.data;
       } else {
        const message = 'Error fetching deposit params data';
        logger.logToConsole(LogLevel.ERROR, message);
        toast.error(message);
        }
      });
    },
    async fetchProposalsDetailsTally(id:number, lockscreen = true) {
      await apiFactory.proposalsApi().fetchProposalsDetailsTally(id, lockscreen).then(response => {
        if (response.error == null && response.data != undefined) {
          this.proposalDetailsTally = response.data;
        } else {
          const message = 'Error fetching proposals details tally';
          logger.logToConsole(LogLevel.ERROR, message);
          toast.error(message);
        }
      });
    },
    async fetchProposalsDetailsTallyList(ids:number[], lockscreen = true) {
      await apiFactory.proposalsApi().fetchProposalsDetailsTallyList(ids, lockscreen).then(response => {
        if (response.error == null && response.data != undefined) {
          if(this.proposalDetailsTallyMap == undefined) {
            this.proposalDetailsTallyMap = response.data;
          } else {
             this.proposalDetailsTallyMap = new Map([...this.proposalDetailsTallyMap, ...response.data])
          }
        } else {
          const message = 'Error fetching proposals details tally list';
          logger.logToConsole(LogLevel.ERROR, message);
          toast.error(message);
        }
      });
    },
    clearProposals() {
      this.proposals = Array<Proposal>();
      this.proposalById= new Map<number, number>();
      this.proposalsTally = new Map<number, ProposalTallyResult>();
      this.numberOfActiveProposals = 0;
      this.proposal = undefined;
      this.paginationKey = null;
    },
    clearProposal() {
      this.proposal = undefined;
      this.proposalTally = undefined;
      this.userVote = null;

    },
    clearUserVote() {
      this.userVote = null;
    },
    clear() {
      this.clearProposals();
      this.tallyParams = new TallyParams(Number.NaN, Number.NaN, Number.NaN);
      this.minDeposit = new Coin(0n, useConfigurationStore().config.stakingDenom);
    }
  },
  getters: {
    hasProposals(): boolean {
      return this.proposals.length > 0;
    },
    hasProposal(): boolean {
      return this.proposal !== undefined;
    },
    getProposals(): Proposal[] {
      return this.proposals;
    },
    getPaginationKey(): string | null {
      return this.paginationKey;
    },
    getProposal(): Proposal | undefined {
      return this.proposal;
    },
    getProposalDetailsTally(): ProposalDetailsTally | undefined {
      return this.proposalDetailsTally;
    },
    getTallyParams(): TallyParams {
      return this.tallyParams;
    },
    getMinDeposit(): Coin {
      return this.minDeposit;
    },
    getProposalById(): (proposalId: number) => Proposal | undefined {
      return (proposalId: number) => {
        const index = this.proposalById.get(proposalId);
        return index !== undefined ? this.proposals[index] : undefined;
      };
    },
    getProposalTally(): (proposal?: Proposal) => ProposalTallyResult {
      return (proposal?: Proposal) => {
        if (!proposal) {
          return new ProposalTallyResult(0n, 0n, 0n, 0n);
        }
        const tally = this.proposalsTally.get(proposal.proposalId);
        if (tally) {
          return tally;
        }
        return proposal.finalTallyResult;
      };

    },
    getSelectedProposalTally(): ProposalTallyResult {
      if (!this.proposal) {
        return new ProposalTallyResult(0n, 0n, 0n, 0n);
      }
      const tally = this.proposalTally;
      if (tally) {
        return tally;
      }
      return this.proposal.finalTallyResult;
    },
    getProposalDetailsTallyById(): (proposalId: number) => ProposalDetailsTally | undefined {
      return (proposalId: number) => {
        return this.proposalDetailsTallyMap.get(proposalId);
      };
    },

  },
});

